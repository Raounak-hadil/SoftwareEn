import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // 1️⃣ Get logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // 2️⃣ Map Supabase Auth UUID -> integer doctor ID
  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("email", user.email)
    .single();

  if (doctorError || !doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  // 3️⃣ Fetch notifications using integer doctor_id
  const { data, error } = await supabase
    .from("doctors_requests")
    .select("id, blood_type, quantity, status, request_date, seen, request_no")
    .eq("doctor_id", doctor.id)
    .order("request_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4️⃣ Format response
  const notifications = data.map((req) => ({
    request_no: req.request_no || req.id, // Use request_no if available, fallback to id
    blood_group: req.blood_type,
    quantity: req.quantity,
    status: req.status,
    scheduled: req.request_date,
    seen: req.seen || false,
  }));

  return NextResponse.json({ notifications });
}
