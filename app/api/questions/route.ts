import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// This endpoint is public – no auth required
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phoneNum, Description } = body;

    if (!fullName || !phoneNum || !Description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ContactUs')
      .insert([{ fullName, phoneNum, Description }])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data, message: 'Question submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
