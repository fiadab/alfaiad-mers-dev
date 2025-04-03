import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
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
      const role = user.publicMetadata.role as string || 'user';
      
      // Admin route protection
      if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Profile completion check
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const profile = await db.userProfile.findUnique({
          where: { userId }
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