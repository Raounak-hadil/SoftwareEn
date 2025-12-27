import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        // Check for authentication (optional for now as per other admin endpoints, but good practice)
        // const { data: { user } } = await supabase.auth.getUser();
        // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch quantity and type from all stock entries
        const { data, error } = await supabase
            .from("stock")
            .select("quantity, blood_type");

        if (error) {
            console.error("Supabase error fetching stock:", error);
            throw error;
        }

        // Calculate sum for total blood units and distribution by type
        const distributionMap: Record<string, number> = {};
        let totalUnits = 0;

        data?.forEach(item => {
            const qty = Number(item.quantity) || 0;
            totalUnits += qty;
            const type = item.blood_type || 'Unknown';
            distributionMap[type] = (distributionMap[type] || 0) + qty;
        });

        // Convert to ChartPoint format (label as "month" for compatibility)
        const distribution = Object.entries(distributionMap).map(([type, total]) => ({
            month: type,
            value: total
        })).sort((a, b) => a.month.localeCompare(b.month));

        // Fetch count from hospitals_requests for "Connected hospitals"
        const { count: connectedHospitalsCount, error: reqError } = await supabase
            .from("hospitals_requests")
            .select("*", { count: 'exact', head: true });

        if (reqError) {
            console.error("Supabase error fetching hospitals_requests count:", reqError);
            // We don't throw, just log and continue with 0 or potentially null
        }

        // Fetch count from hospitals_requests for "Total Pending"
        const { count: pendingCount, error: pendingError } = await supabase
            .from("hospitals_requests")
            .select("*", { count: 'exact', head: true })
            .eq("status", "Pending");

        if (pendingError) {
            console.error("Supabase error fetching pending requests count:", pendingError);
        }

        return NextResponse.json({
            success: true,
            stats: {
                total_blood_units: totalUnits,
                connected_hospitals: connectedHospitalsCount || 0,
                total_pending: pendingCount || 0,
                blood_distribution: distribution
            }
        });

    } catch (err: any) {
        console.error("Error fetching admin stats:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
