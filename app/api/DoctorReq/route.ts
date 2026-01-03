import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.user) {
      return authResult.response!;
    }
    const userEmail = authResult.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Authenticated user has no email' },
        { status: 400 },
      );
    }
    console.log('Authenticated user email:', userEmail);

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('doctors_requests')
      .select('*')
      .eq('doctor_id', doctor.id)
      .order('request_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { data, message: 'Doctor requests retrieved successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DoctorReq error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
