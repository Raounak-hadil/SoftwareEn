import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();
  const { email, password, hosname, phone_num, city, state, year_of_est, type, license_file } = body;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    // More specific error message
    if (authError.message.includes("already registered")) {
      return NextResponse.json({ 
        error: "This email is already registered. Please use a different email or sign in." 
      }, { status: 400 });
    }
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Check if user was actually created (not just returning existing user)
  if (!authData.user) {
    return NextResponse.json({ 
      error: "Signup failed. Please try again." 
    }, { status: 400 });
  }

  const { error } = await supabase
    .from("hospitals")
    .insert({
      auth_id: authData.user.id,
      email,
      hosname,
      phone_num,
      city,
      state,
      year_of_est,
      type,
      license_file
    });

  if (error) {
    // If hospital insert fails, we should ideally delete the auth user
    // but for now just return the error
    return NextResponse.json({ 
      error: `Account created but hospital registration failed: ${error.message}` 
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: authData.user });
}