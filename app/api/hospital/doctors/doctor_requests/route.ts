import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if user is a hospital
  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!hospital) {
    return NextResponse.json({ error: "You are not logged in as a hospital" }, { status: 403 });
  }

  // Get doctors belonging to this hospital
  const { data: doctors, error } = await supabase
    .from("hospital_doctors")
    .select(`
      doctor_id,
      doctors (
        id,
        first_name,
        last_name,
        email,
        phone_num,
        speciality
      )
    `)
    .eq("hospital_id", hospital.id)
    .eq("accepted", "Waiting");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    doctors: doctors.map(d => d.doctors) // flatten response
  });
}
