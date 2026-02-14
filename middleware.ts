// middleware.ts (Next.js 13+)
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    console.log('Middleware running for:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

// Protect API routes and pages that require authentication
export const config = {
  matcher: [
    '/api/chat/:path*',
    '/dashboard/:path*',
    '/protected/:path*'
  ]
};