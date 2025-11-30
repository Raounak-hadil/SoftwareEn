import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
const supabase = createRouteHandlerClient({ cookies });

const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
const body = await req.json();
const { id, actual_date } = body; // 'id' is the donor_request ID

// 1. Get hospital integer ID
const { data: hospital, error: hospitalError } = await supabase
 .from("hospitals")
 .select("id")
 .eq("auth_id", user.id)
 .single();
if (hospitalError) return NextResponse.json({ error: hospitalError.message }, { status: 400 });

// 2. Update donor request and status
// Crucially checks both 'id' (request ID) and 'hospital_id' (security check)
const { data, error } = await supabase
 .from("donors_requests")
 .update({ actual_date, status: "Scheduled" })
 .eq("id", id)
 .eq("hospital_id", hospital.id);

if (error) return NextResponse.json({ error: error.message }, { status: 400 });

return NextResponse.json({ success: true, data });
}