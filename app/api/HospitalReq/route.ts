/* | column_name      |
| ---------------- |
| id               |
| hospital_from_id |
| hospital_to_id   |
| blood_type       |
| priority         |
| units_needed     |
| notes            |
| status           | */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('hospitals_requests')
            .select(`
                *,
                hospital_from:hospital_from_id (hosname),
                hospital_to:hospital_to_id (hosname)
            `);

        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "invalid request" }, { status: 500 });
    }
}