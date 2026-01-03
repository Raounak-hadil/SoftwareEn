import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const body = await req.json();
    const { id, status } = body; // 'id' is the donor_request ID

    // 1. Get hospital integer ID
    const { data: hospital, error: hospitalError } = await supabase
        .from("hospitals")
        .select("id")
        .eq("auth_id", user.id)
        .single();
    if (hospitalError) return NextResponse.json({ error: hospitalError.message }, { status: 400 });

    // 2. Update donor request status and fetch the updated row (optimization with .select("*"))
    const { data: updatedRequest, error } = await supabase
        .from("donors_requests")
        .update({ status })
        .eq("id", id)
        .eq("hospital_id", hospital.id) // Security check
        .select("*") // <-- Retrieve the updated row for the next step
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // 3. If Completed and donor is 'Yes' for forever, add to permanent_donors table
    if (status == "Completed") {
        // updatedRequest now holds the donor request data
        if (updatedRequest?.forever === "Yes") {
            const { error: upsertError } = await supabase
                .from("permanent_donors")
                .upsert({
                    hospital_id: hospital.id,
                    first_name: updatedRequest.first_name,
                    last_name: updatedRequest.last_name,
                    phone_num: updatedRequest.phone_num,
                    email: updatedRequest.email,
                    blood_type: updatedRequest.blood_type,
                });

            // IMPORTANT: Check for upsert error. This is where the RLS error would appear.
            if (upsertError) {
                console.error("Permanent Donor Upsert Error:", upsertError);
                // Optionally return a 500 error, but typically you might log and continue.
            }
        }
    }

    return NextResponse.json({ success: true, data: updatedRequest });
}