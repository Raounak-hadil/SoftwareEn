import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Path: ${pathname}`);

  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
    '/testing',
    '/testing2'
  ];

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log(`[Middleware] Setting cookies: ${cookiesToSet.map(c => c.name).join(', ')}`);
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.log(`[Middleware] Error getting user: ${error.message}`);
  }

  if (user) {
    console.log(`[Middleware] User authenticated: ${user.email}`);
  } else {
    const authCookies = request.cookies.getAll().filter(c => c.name.includes('auth-token'));
    if (authCookies.length > 0) {
      console.log(`[Middleware] Auth cookies found but getUser() returned null. Cookie names: ${authCookies.map(c => c.name).join(', ')}`);
    } else {
      console.log(`[Middleware] No auth cookies found.`);
    }
  }

  const adminRoutes = ['/admin-dashboard', '/admin-hospitals', '/admin-requests'];
  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isAdminRoute) {
    if (!user) {
      console.log(`[Middleware] Anonymous attempt to access admin route: ${pathname}`);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: hospital } = await supabase
      .from('hospitals')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    if (!hospital || hospital.role !== 'admin') {
      console.log(`[Middleware] Unauthorized admin attempt by ${user.email} to ${pathname}`);
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  if (!user && !isPublicRoute) {
    console.log(`[Middleware] Unauthenticated access to protected route ${pathname}, redirecting to login`);
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
