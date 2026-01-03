import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();

  // get input
  const { blood_type, quantity } = await req.json();
  if (!blood_type || !quantity)
    return NextResponse.json({ error: "Missing inputs" }, { status: 400 });

  // auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not auth" }, { status: 401 });

  // get hospital
  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (!hospital)
    return NextResponse.json({ error: "Not hospital account" }, { status: 403 });

  // call function
  const { error } = await supabase.rpc("increment_stock", {
    hospitalid: hospital.id,
    btype: blood_type,
    qty: quantity
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
