"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />
  }
);

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const isAdminPage = pathname?.startsWith("/admin");

  if (!isLoaded) {
    return (
      <div className="flex gap-x-2 ml-auto">
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <div className="flex gap-x-2 ml-auto">
      {user ? (
        <>
          {isAdmin && (
            <Link href={isAdminPage ? "/" : "/admin/jobs"} legacyBehavior>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-700/20 hover:bg-purple-50"
              >
                {isAdminPage ? "Back to Home" : "Admin Dashboard"}
              </Button>
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <Link href="/sign-in" legacyBehavior>
          <Button
            variant="outline"
            className="border-purple-700/20 hover:bg-purple-50"
          >
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};
