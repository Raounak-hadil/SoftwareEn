import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // get logged in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // get hospital
  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (!hospital)
    return NextResponse.json({ error: "Not hospital account" }, { status: 403 });

  // fetch stock
  const { data: stock, error } = await supabase
    .from("stock")
    .select("blood_type, quantity")
    .eq("hospital_id", hospital.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, stock });
}
