import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
<<<<<<< HEAD
    // Fetch only the ID and Name (and City if you want to group them)
    // Ordered alphabetically by name for better UX
    const { data: hospitals, error } = await supabase
      .from("hospitals")
      .select("id, hosname, city") // Add other fields if needed for display
=======
    const { data: hospitals, error } = await supabase
      .from("hospitals")
      .select("*")
>>>>>>> dd0fcb94c4c5d1ae95d596f42e05cf506b1db64f
      .order("hosname", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ hospitals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}