import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const body = await req.json();
  const { doctor_id } = body;

  if (!doctor_id) {
    return NextResponse.json({ error: "doctor_id required" }, { status: 400 });
  }

  // Get logged in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if logged in user is a hospital
  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!hospital) {
    return NextResponse.json({ error: "You are not logged in as a hospital" }, { status: 403 });
  }

  // INSERT into hospital_doctors
  const { error } = await supabase
    .from("hospital_doctors")
    .insert({ hospital_id: hospital.id, doctor_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Doctor added successfully" });
}
