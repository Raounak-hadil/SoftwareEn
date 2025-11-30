import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const body = await req.json();
  const { doctor_id } = body;

  if (!doctor_id) {
    return NextResponse.json({ error: "doctor_id required" }, { status: 400 });
  }

  // get logged in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // get hospital ID
  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!hospital) {
    return NextResponse.json({ error: "You are not logged in as a hospital" }, { status: 403 });
  }

  // DELETE link
  const { error } = await supabase
    .from("hospital_doctors")
    .delete()
    .eq("hospital_id", hospital.id)
    .eq("doctor_id", doctor_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Doctor removed successfully" });
}
