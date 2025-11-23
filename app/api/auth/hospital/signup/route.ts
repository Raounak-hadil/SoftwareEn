import { NextResponse } from "next/server";
import { supabase } from "../../../../../supabase/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      hosname,
      email,
      year_of_est,
      type,
      phone_num,
      country,
      city,
      state,
      password,
      license_file
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const { data, error } = await supabase
      .from("hospitals")
      .insert({
        hosname,
        email,
        year_of_est,
        type,
        phone_num,
        country,
        city,
        state,
        license_file,
        password: hashedPassword,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ hospital: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
