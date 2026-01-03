// /app/api/hospital_requests/history/route.ts
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  // 1. Get the logged-in hospital's integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (hospitalError || !hospital) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 2. Fetch requests where this hospital is involved AND the status is finalized
  const { data: requests, error } = await supabase
    .from("hospitals_requests")
    .select(`
      *,
      hospital_from_details:hospital_from_id (hosname, city),
      hospital_to_details:hospital_to_id (hosname, city)
    `)
    .or(`hospital_from_id.eq.${hospital.id},hospital_to_id.eq.${hospital.id}`)
    .in("status", ["Approved", "Rejected"]) // Finalized statuses
    .order('id', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, history: requests });
}