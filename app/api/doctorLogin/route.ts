import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateToken } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify doctor exists in database
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', email)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Generate token for the doctor
    const token = generateToken({
      email: doctor.email,
      id: doctor.id?.toString(),
      role: 'doctor',
    });

    return NextResponse.json({
      success: true,
      token,
      doctor: {
        id: doctor.id,
        email: doctor.email,
        name: doctor.name || doctor.full_name,
      },
    });
  } catch (error) {
    console.error('Doctor login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

