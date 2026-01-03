import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
    try {
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
