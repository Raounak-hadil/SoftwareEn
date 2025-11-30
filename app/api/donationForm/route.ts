import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try{ 
        const validBloodTypes = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
        const body = await request.json();
        let { first_name, last_name, phone_num, email, last_donation, age, blood_type, preferred_date, forever, hospital_name } = body;

        if(age < 19 || age > 100) return NextResponse.json({ error: "your age is not suitable" }, { status: 400 });
        if(!validBloodTypes.includes(blood_type))  return NextResponse.json({ error: "invalid blood type" }, { status: 400 });
        // hospital id by name ?
        const { data: hospital } = await supabase.from('hospitals').select('id').eq('hosname', hospital_name).single();
        if (!hospital) {
        return NextResponse.json({ error: "invalid hospital" }, { status: 400 });
        }
        const hospital_id = hospital.id; 
        forever = forever ? 'Yes' : 'No';
        const status = 'Pending';
        const { data, error } = await supabase.from('donors_requests').insert(
            [{ first_name, last_name, phone_num, email, last_donation, age, blood_type, preferred_date, forever, hospital_id, status }]
        ).select();
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "invalid request" }, { status: 500 });
    }
}