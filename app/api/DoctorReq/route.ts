import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/utils/auth';

// Return doctor_requests filtered by the authenticated doctor's id
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request using our signed token / session
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

    // 1. Find doctor by email
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // 2. Fetch requests for this doctor
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
