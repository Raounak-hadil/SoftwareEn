import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // get logged in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // get hospital
  // try to find hospital by auth_id first
  let { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id,email,auth_id")
    .eq("auth_id", user.id)
    .single();

  // fallback: find hospital by user email if not found by auth_id
  if (!hospital) {
    const userEmail = user.email;
    if (!userEmail)
      return NextResponse.json({ error: "Hospital not found (no email)" }, { status: 403 });

    const { data: hospitalByEmail, error: emailErr } = await supabase
      .from("hospitals")
      .select("id,email,auth_id")
      .eq("email", userEmail)
      .single();

    hospital = hospitalByEmail as any;
    hospitalError = emailErr;
  }

  if (hospitalError || !hospital)
    return NextResponse.json({ error: "Not hospital account" }, { status: 403 });

  // fetch stock
  const { data: stock, error } = await supabase
    .from("stock")
    .select("blood_type, quantity")
    .eq("hospital_id", hospital.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, stock });
}
