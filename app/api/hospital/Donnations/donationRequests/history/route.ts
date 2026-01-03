import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  // Get hospital integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (hospitalError) return NextResponse.json({ error: hospitalError.message }, { status: 400 });

  // Get all completed/canceled donor requests
  const { data: history, error } = await supabase
    .from("donors_requests")
    .select("*")
    .eq("hospital_id", hospital.id)
    .in("status", ["Completed", "Canceled"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, history });
}
