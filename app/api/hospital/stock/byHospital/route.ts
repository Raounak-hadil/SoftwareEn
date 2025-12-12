import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalIdRaw = searchParams.get('hospital_id') || searchParams.get('id');
    if (!hospitalIdRaw) return NextResponse.json({ error: 'hospital_id query required' }, { status: 400 });

    // coerce numeric ids when possible
    const hospitalIdNum = Number(hospitalIdRaw);
    const hospitalId = Number.isFinite(hospitalIdNum) && !Number.isNaN(hospitalIdNum) ? hospitalIdNum : hospitalIdRaw;

    const supabase = createRouteHandlerClient({ cookies });

    // select all columns to avoid relying on a specific primary key column name
    const { data: stock, error } = await supabase
      .from('stock')
      .select('*')
      .eq('hospital_id', hospitalId);

    if (error) {
      // return details for debugging while keeping 200 to avoid client-side exceptions
      console.error('byHospital supabase error:', error.message);
      return NextResponse.json({ success: false, error: error.message, stock: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, stock: stock ?? [] });
  } catch (err: any) {
    console.error('byHospital unexpected error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
