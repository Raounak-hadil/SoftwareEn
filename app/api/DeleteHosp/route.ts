import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function deleteHospital(id: string) {
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

  const { error } = await supabase
    .from("hospitals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting hospital:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function DELETE(req: Request) {
  try {
    let id: string | null = null;
    
    try {
      const body = await req.json();
      id = body?.id ?? null;
    } catch {}

    if (!id) {
      const url = new URL(req.url);
      id = url.searchParams.get("id");
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "hospital id is required" },
        { status: 400 }
      );
    }

    const result = await deleteHospital(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DeleteHosp route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
