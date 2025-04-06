// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from './lib/db';

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/jobs(.*)',
  '/profile(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Bypass public routes
    if (req.nextUrl.pathname.startsWith('/api/edgestore')) {
      return NextResponse.next();
    }

    // Handle protected routes
    if (protectedRoutes(req)) {
      const { userId } = auth();

      // Redirect unauthenticated users
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url.toString());
        return NextResponse.redirect(signInUrl);
      }

      // Get user with metadata
      const user = await clerkClient.users.getUser(userId);
      
      // Validate role metadata
      const role = (user.publicMetadata.role as 'admin' | 'user') ?? 'user';
      if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Profile completion check
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const profile = await db.userProfile.findUnique({
          where: { userId },
          select: { id: true }
        });
        
        if (!profile) {
          return NextResponse.redirect(new URL('/complete-profile', req.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};