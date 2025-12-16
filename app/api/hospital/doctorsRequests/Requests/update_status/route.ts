// /app/api/doctor_requests/update_status/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const body = await req.json();
  // request_id is the ID from doctors_requests table
  // new_status is 'Approved' or 'Rejected'
  const { request_id, new_status } = body; 

  // 2. Get the logged-in hospital's integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  
  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 3. Update the request status
  // Security Check: Ensure only the correct hospital can update the request.
  const { data, error } = await supabase
    .from("doctors_requests")
    .update({ status: new_status })
    .eq("id", request_id)          
    .eq("Hospital_id", hospital.id); // Hospital must own the request

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, data });
}