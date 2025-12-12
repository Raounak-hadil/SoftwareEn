import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function deleteHospital(id: string) {
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
    // try parse JSON body first
    let id: string | null = null;
    try {
      const body = await req.json();
      id = body?.id ?? null;
    } catch (e) {
      // ignore body parse errors
    }

    // fallback to query param
    if (!id) {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'hospital id is required' }, { status: 400 });
    }

    const result = await deleteHospital(id);
    if (!result || result.success === false) {
      return NextResponse.json({ success: false, error: result?.error ?? 'delete failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DeleteHosp route error:', err);
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
