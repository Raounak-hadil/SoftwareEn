import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAuth } from "@/utils/auth";

export async function POST(request: NextRequest) {
    try {
        // Authenticate the request
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

        // Update the doctor's description using their email from the token
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
