import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    // 1. Extract hospitalIds (expecting an array of IDs)
    const {
      first_name,
      last_name,
      email,
      phone_num,
      speciality,
      password,
      hospitalIds // [1, 2, 5] example
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    // 2. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 3. Insert doctor profile
    const { data: doctorData, error: dbError } = await supabase
      .from("doctors")
      .insert({
        auth_id: authData.user?.id,
        first_name,
        last_name,
        email,
        phone_num,
        speciality,
        Hospital_id: (hospitalIds && hospitalIds.length > 0) ? hospitalIds[0] : null
      })
      .select("id, first_name, last_name") // Select the specific fields you need, specially ID
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    // 4. Insert Hospital Associations (The new part)
    if (hospitalIds && Array.isArray(hospitalIds) && hospitalIds.length > 0) {

      // Prepare the array of objects for bulk insertion
      const hospitalMap = hospitalIds.map((hospId: string | number) => ({
        doctor_id: doctorData.id, // Use the ID returned from step 3
        hospital_id: hospId,
        accepted: 'Waiting'
      }));

      const { error: linkError } = await supabase
        .from("hospital_doctors")
        .insert(hospitalMap);

      if (linkError) {
        // Optional: You might want to log this error, but still return success 
        // regarding the user creation, or fail strictly.
        console.error("Error linking hospitals:", linkError);
        return NextResponse.json(
          { error: "User created, but failed to link hospitals: " + linkError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, doctor: doctorData, user: authData.user });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}