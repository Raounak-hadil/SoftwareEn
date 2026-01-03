// /app/api/doctor_requests/route.ts
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

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

  // 3. Fetch Pending requests for this hospital
  const { data: requests, error } = await supabase
    .from("doctors_requests")
    .select(`
      *,
      doctor_details:doctor_id (first_name, last_name, speciality, email)
    `)
    .eq("Hospital_id", hospital.id)
    .eq("status", "Pending") // Only show requests that need action
    .order('request_date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, pending_requests: requests });
}