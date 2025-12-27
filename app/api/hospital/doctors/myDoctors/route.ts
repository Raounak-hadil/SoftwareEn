import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const queryHospitalId = searchParams.get('hospital_id');

  let targetHospitalId: string | number;

  if (queryHospitalId) {
    // Admin mode: use the provided hospital_id
    targetHospitalId = queryHospitalId;
  } else {
    // Regular mode: get authenticated hospital
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: hospital } = await supabase
      .from("hospitals")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!hospital) {
      return NextResponse.json({ error: "You are not logged in as a hospital" }, { status: 403 });
    }
    targetHospitalId = hospital.id;
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
    .eq("hospital_id", targetHospitalId)
    .eq("accepted", "Accept");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    doctors: doctors.map(d => d.doctors) // flatten response
  });
}
