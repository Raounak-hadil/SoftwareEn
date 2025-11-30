import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try{ 
        const body = await request.json();
        const { fullName, phoneNum, Description } = body;

        const { data, error } = await supabase.from('ContactUs').insert(
            [{ fullName, phoneNum, Description }]
        )
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "invalid request" }, { status: 500 });
    }
}