import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAuth } from "@/utils/auth";

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.user) {
            return authResult.response!;
        }
        const user = authResult.user;
        if (user.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized: User is not a doctor" }, { status: 403 });
        }

        const { description } = await request.json();
        if (!description) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

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
                } catch {}
              },
            },
          }
        );

        const { data, error } = await supabase
            .from("doctors")
            .update({ Description: description })
            .eq("email", user.email)
            .select();

        if (error) {
            console.error("Error updating description:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data,
            message: "Description updated successfully"
        }, { status: 200 });
    } catch (err) {
        console.error("POST EditDesc error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
