import { NextResponse } from "next/server";
import { supabase } from "../../../../../supabase/supabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Get hospital record
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    // Validate password
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create JWT token for the hospital
    const token = jwt.sign(
      { id: data.id, role: "hospital" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, hospital: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
