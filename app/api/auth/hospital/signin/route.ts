import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  let body;
  try {
    body = await req.json();
    console.log("Login body:", body);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    console.log("Email or password missing");
    return NextResponse.json({ error: "Email & password required" }, { status: 400 });
  }

  // Log before calling Supabase
  console.log("Attempting login for email:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Supabase login error:", error);
    return NextResponse.json({ error: "Invalid email or password", details: error }, { status: 401 });
  }

  console.log("Login successful:", data.user?.id);

  return NextResponse.json({ success: true, user: data.user });
}