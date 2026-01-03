import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function PATCH(req: Request) {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { request_id } = body;

    if (!request_id) {
      return NextResponse.json({ error: "request_id is required" }, { status: 400 });
    }

    // Map UUID -> integer doctor_id
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Ensure the notification belongs to this doctor
    const { data: notification, error: checkError } = await supabase
      .from("doctors_requests")
      .select("id")
      .eq("id", request_id)
      .eq("doctor_id", doctor.id)
      .single();

    if (checkError || !notification) {
      return NextResponse.json({ error: "Notification not found or not yours" }, { status: 404 });
    }

    // Mark as seen
    const { error: updateError } = await supabase
      .from("doctors_requests")
      .update({ seen: true })
      .eq("id", request_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
