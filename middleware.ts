// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from './lib/db';

// 1. Configure protected routes
const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/jobs(.*)',
  '/profile(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    // 2. Bypass EdgeStore API routes
    if (req.nextUrl.pathname.startsWith('/api/edgestore')) {
      return NextResponse.next();
    }

    // 3. Handle protected routes
    if (protectedRoutes(req)) {
      const { userId } = auth();

      // 4. Redirect unauthenticated users
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url.toString());
        return NextResponse.redirect(signInUrl);
      }

      // 5. Verify user role
      const user = await clerkClient.users.getUser(userId);
      const role = user.publicMetadata.role as 'admin' | 'user' ?? 'user';

      // 6. Admin route protection
      if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // 7. Profile completion check
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

    // 8. Continue request processing
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    // 9. Error handling with type safety
    return NextResponse.redirect(new URL('/error', req.url));
  }
});

// 10. Type-safe config
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};