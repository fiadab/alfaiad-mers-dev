import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/jobs(.*)',
  '/profile(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoutes(req)) {
    const { userId } = auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as string;

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});
