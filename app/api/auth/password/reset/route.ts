import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { password } = await req.json();
    if (!password) return NextResponse.json({ error: 'Password is required' }, { status: 400 });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return NextResponse.json({ error: error.message || 'Failed to update password' }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
