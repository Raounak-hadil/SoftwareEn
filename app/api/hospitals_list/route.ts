import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: hospitals, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("hosname", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ hospitals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}