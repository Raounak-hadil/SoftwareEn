import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// This endpoint is public – no auth required
export async function POST(request: NextRequest) {
  try {
    const validBloodTypes = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
    const body = await request.json();
    let { first_name, last_name, phone_num, email, last_donation, age, blood_type, preferred_date, forever, hospital_name } = body;

    // Validation
    if (age < 19 || age > 100) {
      return NextResponse.json(
        { error: 'Your age is not suitable' },
        { status: 400 }
      );
    }

    if (!validBloodTypes.includes(blood_type)) {
      return NextResponse.json(
        { error: 'Invalid blood type' },
        { status: 400 }
      );
    }

    // Get hospital id by name
    const { data: hospital, error: hospitalError } = await supabase
      .from('hospitals')
      .select('id')
      .eq('hosname', hospital_name)
      .single();

    if (hospitalError || !hospital) {
      return NextResponse.json(
        { error: 'Invalid hospital' },
        { status: 400 }
      );
    }

    const hospital_id = hospital.id;
    forever = forever ? 'Yes' : 'No';
    const status = 'Pending';

    // Insert donation request
    const { data, error } = await supabase
      .from('donors_requests')
      .insert([
        {
          first_name,
          last_name,
          phone_num,
          email,
          last_donation,
          age,
          blood_type,
          preferred_date,
          forever,
          hospital_id,
          status,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data, message: 'Donation request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DonationForm error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
