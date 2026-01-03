// /app/api/hospital_request/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1. Authenticate and get the requesting hospital's user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  const body = await req.json();
  const { hospital_to_id, email, blood_type, priority, units_needed, notes } = body;

  // 2. Get the requesting hospital's integer ID (hospital_from)
  const { data: hospital_from, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (hospitalError || !hospital_from) return NextResponse.json({ error: hospitalError?.message || "Hospital ID not found" }, { status: 400 });

  // 3. Insert the new request
  const { data, error } = await supabase
    .from("hospitals_requests")
    .insert({
      hospital_from_id: hospital_from.id, // ID of the hospital making the request
      hospital_to_id: hospital_to_id,     // ID of the hospital receiving the request
      email,
      blood_type,
      priority,
      units_needed,
      notes,
      status: "Pending" // Default status
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, data });
}