import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from './lib/db';

// Define protected routes using regular expressions
const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/jobs(.*)',
  '/profile(.*)'
]);

// Middleware function with Clerk integration
export default clerkMiddleware(async (auth, req) => {
  try {
    if (protectedRoutes(req)) {
      const { userId } = auth();

      // Handle unauthenticated users
      if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Verify user role
      const user = await clerkClient.users.getUser(userId);
      const role = (user.publicMetadata.role as string) || 'user';

      // Protect admin routes: only allow access if the user has an admin role
      if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Profile completion check for dashboard routes
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const profile = await db.userProfile.findUnique({
          where: { userId }
        });
        if (!profile) {
          return NextResponse.redirect(new URL('/complete-profile', req.url));
        }
      }
    }
    
    // Proceed to the next middleware or route handler
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    // Redirect to an error page in case of any errors
    return NextResponse.redirect(new URL('/error', req.url));
  }
});
// 