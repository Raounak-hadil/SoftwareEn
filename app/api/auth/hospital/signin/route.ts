import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
<<<<<<< HEAD
=======

  let body;
  try {
    body = await req.json();
    console.log("Login body:", body);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
>>>>>>> dd0fcb94c4c5d1ae95d596f42e05cf506b1db64f

  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Correct: setSession expects { access_token, refresh_token }
  if (data.session) {
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    });
  }

<<<<<<< HEAD
  return NextResponse.json({ success: true, user: data.user, session: data.session });
=======
  return NextResponse.json({
    success: true,
    user: data.user,
    token: data.session?.access_token
  });
>>>>>>> dd0fcb94c4c5d1ae95d596f42e05cf506b1db64f
}
