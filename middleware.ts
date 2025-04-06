import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "./lib/db";

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

    // Bypass for static assets and API routes
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/static") ||
      /\\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$/.test(pathname)
    ) {
      return NextResponse.next();
    }

    if (protectedRoutes(req)) {
      if (!userId) {
        const signInUrl = new URL("/sign-in", url);
        signInUrl.searchParams.set("redirect_url", url.toString());
        return NextResponse.redirect(signInUrl);
      }

      const user = await clerkClient.users.getUser(userId);
      const role = ["admin", "user"].includes(user.publicMetadata.role as string) 
        ? (user.publicMetadata.role as "admin" | "user") 
        : "user";

      // Admin route protection
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", url));
      }

      // Profile completion check
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/user")) {
        const profile = await db.userProfile.findUnique({
          where: { userId },
          select: { id: true },
        });
        
        if (!profile) {
          return NextResponse.redirect(new URL("/profile-setup", url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    const errorUrl = new URL("/error", req.nextUrl);
    errorUrl.searchParams.set("code", "MIDDLEWARE_ERROR");
    return NextResponse.redirect(errorUrl);
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};