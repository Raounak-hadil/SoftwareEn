import { NextResponse } from "next/server";
import { supabase } from "../../../../../supabase/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name ,
      email,
      phone_num,
      speciality,
      password,
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const { data, error } = await supabase
      .from("doctors")
      .insert({
        first_name,
      last_name ,
      email,
      phone_num,
      speciality,
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
