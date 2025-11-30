import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try{ 
       const {data, error} = await supabase.from('doctors_requests').select('*');
       
       if(error) return NextResponse.json({error: error.message}, {status: 400})
        return NextResponse.json({data}, {status: 200})
    } catch (error) {
        return NextResponse.json({ error: "invalid request" }, { status: 500 });
    }
}