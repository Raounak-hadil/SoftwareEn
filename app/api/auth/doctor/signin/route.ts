import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    // Supabase Auth login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 401 });
    }

    // Fetch doctor profile using auth_id
    const { data: doctorData, error: dbError } = await supabase
      .from("doctors")
      .select("*")
      .eq("auth_id", data.user?.id)
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: data.user, doctor: doctorData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
