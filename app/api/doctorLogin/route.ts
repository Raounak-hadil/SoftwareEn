import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
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
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify doctor exists in the doctors table
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("auth_id", authData.user?.id)
      .single();

    if (doctorError || !doctor) {
      // Sign out if they aren't actually a doctor
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: "Access denied: This account is not registered as a doctor." },
        { status: 403 }
      );
    }

    // 3. Generate token for the doctor (legacy support if needed)
    const token = generateToken({
      email: doctor.email,
      id: doctor.id?.toString(),
      role: "doctor",
    });

    return NextResponse.json({
      success: true,
      token,
      doctor: {
        id: doctor.id,
        email: doctor.email,
        name: doctor.name || `${doctor.first_name} ${doctor.last_name}`,
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
