import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // 1️⃣ Get logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

  // 2️⃣ Get hospital integer ID
  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (hospitalError) return NextResponse.json({ error: hospitalError.message }, { status: 400 });

  // 3️⃣ Get donor requests for this hospital
  const { data: requests, error: requestsError } = await supabase
    .from("donors_requests")
    .select("*")
    .eq("hospital_id", hospital.id); // integer comparison

  if (requestsError) return NextResponse.json({ error: requestsError.message }, { status: 400 });

  return NextResponse.json({ success: true, requests });
}
