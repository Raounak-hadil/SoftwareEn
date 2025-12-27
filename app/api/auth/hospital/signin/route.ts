import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";

export async function POST(req: Request) {
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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email & password required" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: "Invalid email or password", details: error }, { status: 401 });
  }

  const { data: hospital, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id, role, hosname")
    .eq("auth_id", data.user.id)
    .single();

  if (hospitalError || !hospital) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Access denied: This account is not registered as a hospital." }, { status: 403 });
  }

  const token = generateToken({
    email: data.user.email!,
    id: hospital.id.toString(),
    role: hospital.role || 'hospital',
  });

  return NextResponse.json({
    success: true,
    user: data.user,
    role: hospital.role,
    token: token,
    hospital_name: hospital.hosname
  });
}
