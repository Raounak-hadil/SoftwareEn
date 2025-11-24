import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();
  const { email, password, hosname, phone_num, city, state, year_of_est, type, license_file } = body;

  // Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Insert hospital profile using auth_id
  const { error } = await supabase
  .from("hospitals")
  .insert({
    auth_id: authData.user!.id,
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user: authData.user });
}
