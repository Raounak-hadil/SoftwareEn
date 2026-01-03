import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/utils/auth';

// Return doctor profile + sessions, using our custom auth token (not Supabase access token)
export async function GET(req: NextRequest) {
  try {
    // Authenticate using our signed token (or session)
    const authResult = await requireAuth(req);
    if (!authResult.user) {
      return authResult.response!;
    }

    const user = authResult.user;

    // Support two modes:
    // - ?hospital_id=...  -> return all doctors for that hospital (admin use)
    // - ?email=... or default authenticated user email -> return single doctor profile + sessions
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get('hospital_id');

    if (hospitalId) {
      // return list of doctors for the hospital
      const { data: doctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('hospital_id', hospitalId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, doctors: doctors || [] }, { status: 200 });
    }

    // Optional email override via query string, otherwise use authenticated email
    const emailFilter = searchParams.get('email');
    const emailToUse = emailFilter || user.email;

    if (!emailToUse) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    // Get the full doctor profile by email
    const { data: profile, error: profileError } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', emailToUse)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch associated hospital name if exists
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

    // Get available sessions for this doctor
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
