// app/api/hospital/review-doctor/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function PUT(req: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const body = await req.json();
  const { doctor_id, status } = body;

  // 1. Check if required fields exist
  if (!doctor_id || !status) {
    return NextResponse.json({ error: "Missing hospital_id, doctor_id, or status" }, { status: 400 });
  }

  // 2. Validate status input
  if (status !== 'Accept' && status !== 'Reject') {
    return NextResponse.json({ error: "Status must be 'Accept' or 'Reject'" }, { status: 400 });
  }
  // 1. Get hospital ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 3. Update the database
  const { data, error } = await supabase
    .from("hospital_doctors")
    .update({ accepted: status })
    .eq("hospital_id", hospital.id)
    .eq("doctor_id", doctor_id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: `Doctor ${status}ed successfully`, data });

}