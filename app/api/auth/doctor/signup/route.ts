import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const body = await req.json();
    const { first_name, last_name, email, phone_num, speciality, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert doctor profile in database with auth_id
    const { data: doctorData, error: dbError } = await supabase
      .from("doctors")
      .insert({
        auth_id: authData.user?.id,
        first_name,
        last_name,
        email,
        phone_num,
        speciality
      })
      .select("*")
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, doctor: doctorData, user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
