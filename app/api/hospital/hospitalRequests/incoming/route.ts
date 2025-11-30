// /app/api/hospital_requests/incoming/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  // 1. Get the logged-in hospital's integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  
  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 2. Fetch requests sent TO this hospital that are Pending
  const { data: requests, error } = await supabase
    .from("hospitals_requests")
    .select(`
      *,
      hospital_from_details:hospital_from_id (hosname, city)
    `)
    .eq("hospital_to_id", hospital.id)
    .eq("status", "Pending")
    .order('id', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json({ success: true, incoming_requests: requests });
}