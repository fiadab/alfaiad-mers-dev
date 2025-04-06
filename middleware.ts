// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from './lib/db';

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/jobs(.*)',
  '/profile(.*)',
  '/user(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Bypass routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      /\.(svg|png|jpg|jpeg|gif|ico)$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    // Handle protected routes
    if (protectedRoutes(req)) {
      const { userId } = auth();

      // Redirect unauthenticated
      if (!userId) {
        const signInUrl = new URL('/sign-in', url);
        signInUrl.searchParams.set('redirect_url', url.toString());
        return NextResponse.redirect(signInUrl);
      }

      // Get user securely
      const user = await clerkClient.users.getUser(userId);
      const role = user.publicMetadata.role as 'admin' | 'user' || 'user';

      // Admin protection
      if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', url));
      }

      // Profile check
      if (['/dashboard', '/user'].some(p => pathname.startsWith(p))) {
        const profile = await db.userProfile.findUnique({
          where: { userId },
          select: { id: true }
        });
        if (!profile) return NextResponse.redirect(new URL('/complete-profile', url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};