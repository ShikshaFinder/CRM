import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes except auth pages and public assets
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/signup') ||
          pathname.startsWith('/verify-email') ||
          pathname.startsWith('/reset-password') ||
          pathname.startsWith('/forgot-password')
        ) {
          return true;
        }
        
        // Require authentication for all other routes
        return !!token;
      },
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

