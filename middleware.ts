import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // List of protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/habits'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );


  // If the route is protected, check for the access token
  if (isProtectedRoute) {
    
    const accessToken = req.cookies.get('access_token')?.value;
    

    // If no access token, redirect to login
    if (!accessToken) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Config to specify which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/habits/:path*'],
};