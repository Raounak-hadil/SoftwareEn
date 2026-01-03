// /app/api/hospital_requests/update_status/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1. Authenticate and get the updating hospital's user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const body = await req.json();
  // Expects the ID of the request and the new status
  const { request_id, new_status } = body;

  // 2. Get the logged-in hospital's integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 3. Update the request status
  // CRITICAL SECURITY CHECK: 
  //   - .eq("id", request_id) ensures the correct request is targeted.
  //   - .eq("hospital_to", hospital.id) ensures the logged-in user is the intended recipient.
  const { data, error } = await supabase
    .from("hospitals_requests")
    .update({ status: new_status })
    .eq("id", request_id)
    .eq("hospital_to_id", hospital.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, data });
}