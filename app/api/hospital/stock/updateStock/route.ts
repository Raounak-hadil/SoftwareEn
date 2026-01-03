import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function PUT(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { id, blood_type, quantity } = body;

  console.log("Update stock request body:", body);
  console.log("Parsed values - id:", id, "blood_type:", blood_type, "quantity:", quantity);

  // Validate inputs - allow id to be 0, but check it's not null/undefined
  // Allow quantity to be 0, but check it's not null/undefined
  if (id === null || id === undefined || !blood_type || blood_type.trim() === '' || quantity === null || quantity === undefined) {
    console.error("Validation failed - id:", id, "blood_type:", blood_type, "quantity:", quantity);
    return NextResponse.json({ error: "Missing inputs: id, blood_type, and quantity are required" }, { status: 400 });
  }

  // Validate quantity is a number and non-negative
  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum < 0) {
    return NextResponse.json({ error: "Quantity must be a non-negative number" }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not auth" }, { status: 401 });

  const { data: hospital } = await supabase
    .from("hospitals")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  if (!hospital)
    return NextResponse.json({ error: "Not hospital account" }, { status: 403 });

  // Update stock: try by id first, then fall back to other strategies if the DB schema differs
  let updateResult: any;
  try {
    updateResult = await supabase
      .from("stock")
      .update({ blood_type, quantity: quantityNum })
      .eq("id", id)
      .eq("hospital_id", hospital.id)
      .select()
      .single();

    // If the first attempt returned an error, attempt fallbacks for different schemas
    if (updateResult.error) {
      const msg = updateResult.error.message || String(updateResult.error);

      // If the error mentions a missing id column, try `stock_id` and then a match by hospital+blood_type
      if (/column .*\bid\b.*does not exist/i.test(msg) || /stock\.id/i.test(msg) || /column .*stock_id.*does not exist/i.test(msg)) {
        // Try using `stock_id` as the primary key
        const tryStockId = await supabase
          .from("stock")
          .update({ blood_type, quantity: quantityNum })
          .eq("stock_id", id)
          .eq("hospital_id", hospital.id)
          .select()
          .single();

        if (!tryStockId.error) {
          return NextResponse.json({ success: true, data: tryStockId.data });
        }

        // Lastly, try updating by hospital + blood_type (no id required)
        const tryMatch = await supabase
          .from("stock")
          .update({ quantity: quantityNum })
          .eq("hospital_id", hospital.id)
          .eq("blood_type", blood_type)
          .select()
          .single();

        if (!tryMatch.error) {
          return NextResponse.json({ success: true, data: tryMatch.data });
        }

        // If all fallbacks failed, return the most descriptive error available
        return NextResponse.json({ error: tryStockId.error?.message || tryMatch.error?.message || msg }, { status: 400 });
      }

      // For other errors, return the original message
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } catch (e: any) {
    console.error("Unexpected error updating stock:", e);
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: updateResult.data });
}

