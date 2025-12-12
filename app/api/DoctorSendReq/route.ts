import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAuth } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.user) {
      return authResult.response!;
    }

    const user = authResult.user;

    if (user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized: User is not a doctor" }, { status: 403 });
    }

    const { quantity, urgency, blood_type, status, seen = false, email } = await request.json();

    if (!quantity || !urgency || !blood_type || !status || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Fetch doctor's internal ID and Hospital_id
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("id, Hospital_id")
      .eq("email", email)
      .single();

    if (doctorError || !doctorData) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const { id: doctor_id, Hospital_id } = doctorData;
    const request_date = new Date().toISOString();

    const { data, error } = await supabase
      .from("doctors_requests")
      .insert([
        {
          Hospital_id,
          doctor_id,
          quantity,
          request_date,
          urgency,
          blood_type,
          status,
          seen,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, message: "Doctor request submitted successfully" }, { status: 200 });

  } catch (err) {
    console.error("POST doctors-requests error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
