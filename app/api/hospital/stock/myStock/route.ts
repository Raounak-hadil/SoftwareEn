import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // get logged in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // get hospital
  // try to find hospital by auth_id first
  let { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id,email,auth_id,hosname")
    .eq("auth_id", user.id)
    .single();

  // fallback: find hospital by user email if not found by auth_id
  if (!hospital) {
    const userEmail = user.email;
    if (!userEmail)
      return NextResponse.json({ error: "Hospital not found (no email)" }, { status: 403 });

    const { data: hospitalByEmail, error: emailErr } = await supabase
      .from("hospitals")
      .select("id,email,auth_id,hosname")
      .eq("email", userEmail)
      .single();

    hospital = hospitalByEmail as any;
    hospitalError = emailErr;
  }

  if (hospitalError || !hospital) {
    console.error("Hospital lookup error:", hospitalError);
    return NextResponse.json({ error: "Not hospital account" }, { status: 403 });
  }

  console.log("Fetching stock for hospital ID:", hospital.id);

  // fetch stock - use select('*') to get all columns in case structure differs
  const { data: stock, error } = await supabase
    .from("stock")
    .select("*")
    .eq("hospital_id", hospital.id);

  if (error) {
    console.error("Stock fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.log("Stock fetched:", stock?.length || 0, "items");

  return NextResponse.json({
    success: true,
    stock: stock || [],
    hospital_id: hospital.id,
    hospital_name: hospital.hosname
  });
}