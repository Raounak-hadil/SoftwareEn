import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET() {
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

    try {
        const { data, error } = await supabase
            .from("stock")
            .select("quantity, blood_type");

        if (error) {
            console.error("Supabase error fetching stock:", error);
            throw error;
        }

        const distributionMap: Record<string, number> = {};
        let totalUnits = 0;

        data?.forEach(item => {
            const qty = Number(item.quantity) || 0;
            totalUnits += qty;
            const type = item.blood_type || 'Unknown';
            distributionMap[type] = (distributionMap[type] || 0) + qty;
        });

        const distribution = Object.entries(distributionMap).map(([type, total]) => ({
            month: type,
            value: total
        })).sort((a, b) => a.month.localeCompare(b.month));

        const { count: connectedHospitalsCount, error: reqError } = await supabase
            .from("hospitals_requests")
            .select("*", { count: 'exact', head: true });

        if (reqError) {
            console.error("Supabase error fetching hospitals_requests count:", reqError);
        }

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