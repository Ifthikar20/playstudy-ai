// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  // If there's no token and trying to access protected route
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If there's a token, verify it
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      
      // Special handling for signin page when already authenticated
      if (request.nextUrl.pathname === '/signin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error);
      // Delete the invalid token
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
    // Protect the signin page from authenticated users
    '/signin'
  ]
};