// app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "./lib/db";

// Define protected routes using path patterns
const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/jobs(.*)",
  "/profile(.*)",
  "/user(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { userId } = auth();
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Ignore static files and API requests
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      /\\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    // Handle protected routes
    if (protectedRoutes(req)) {
      // Redirect unauthenticated users to sign-in
      if (!userId) {
        const signInUrl = new URL("/sign-in", url);
        signInUrl.searchParams.set("redirect_url", url.toString());
        return NextResponse.redirect(signInUrl);
      }

      // Check user role from Clerk metadata
      const user = await clerkClient.users.getUser(userId);
      const role = ["admin", "user"].includes(user.publicMetadata.role as string) 
        ? (user.publicMetadata.role as "admin" | "user") 
        : "user";

      // Validate admin privileges for admin routes
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", url));
      }

      // Profile existence check with loop prevention
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/user")) {
        const profile = await db.userProfile.findUnique({
          where: { userId },
          select: { id: true },
        });
        
        // Allow access to /user even without a profile
        if (!profile && !pathname.startsWith("/user")) {
          return NextResponse.redirect(new URL("/user", url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    
    // Create error URL with origin validation
    const errorUrl = new URL("/error", req.nextUrl.origin);
    errorUrl.searchParams.set("code", "MIDDLEWARE_ERROR");
    
    return NextResponse.redirect(errorUrl);
  }
}, { debug: true });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};