import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const validBloodTypes = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
    const body = await request.json();
    let { first_name, last_name, phone_num, email, last_donation, age, blood_type, preferred_date, forever, hospital_name, hospital_id } = body;

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

    if (!hospital_id) {
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
      hospital_id = hospital.id;
    }

    forever = forever ? 'Yes' : 'No';
    const status = 'Pending';

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
