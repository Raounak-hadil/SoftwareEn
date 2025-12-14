import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
    try {
        const { email, first_name, last_name, phone_num, speciality } = await req.json();

        const { data, error } = await supabase
            .from("doctors")
            .update({
                first_name,
                last_name,
                phone_num,
                speciality,
            })
            .eq("email", email);     // 👈 update by EMAIL

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 500 });
    }
}
