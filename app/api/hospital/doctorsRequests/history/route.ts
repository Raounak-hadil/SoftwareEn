// /app/api/doctor_requests/history/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  // 2. Get the logged-in hospital's integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  
  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 3. Fetch completed/finalized requests for this hospital
  const { data: history, error } = await supabase
    .from("doctors_requests")
    .select(`
      *,
      doctor_details:doctor_id (first_name, last_name, speciality, email)
    `)
    .eq("hospital_id", hospital.id)
    .in("status", ["Approved", "Rejected"]) // Filter for finalized statuses
    .order('request_date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json({ success: true, history });
}