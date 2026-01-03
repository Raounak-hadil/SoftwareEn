import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAuth } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.user) {
      return authResult.response!;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get('hospital_id');

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

    if (hospitalId) {
      const { data: doctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('hospital_id', hospitalId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, doctors: doctors || [] }, { status: 200 });
    }

    const emailFilter = searchParams.get('email');
    const emailToUse = emailFilter || user.email;

    if (!emailToUse) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', emailToUse)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.Hospital_id) {
      const { data: hospData } = await supabase
        .from('hospitals')
        .select('hosname')
        .eq('id', profile.Hospital_id)
        .single();
      if (hospData) {
        (profile as any).hospitals = hospData;
      }
    }

    const { data: sessions } = await supabase
      .from('sessions')
      .select('doctor_id, date, start_time, end_time, is_booked')
      .eq('doctor_id', profile.id)
      .eq('is_booked', false);

    const doctorWithSessions = {
      ...profile,
      available_sessions: sessions || [],
    };

    return NextResponse.json({
      success: true,
      doctor: doctorWithSessions,
    }, { status: 200 });
  } catch (error) {
    console.error('ProfileDoc API Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
