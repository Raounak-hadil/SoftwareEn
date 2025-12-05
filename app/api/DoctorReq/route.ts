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

    const doctorId = authResult.user.id;

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Authenticated doctor has no id in token' },
        { status: 400 },
      );
    }

    // Fetch requests only for this doctor (doctors_requests.doctor_id)
    const { data, error } = await supabase
      .from('doctors_requests')
      .select('*')
      .eq('doctor_id', doctorId);

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
