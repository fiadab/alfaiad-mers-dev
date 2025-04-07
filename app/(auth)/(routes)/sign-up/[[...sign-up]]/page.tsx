"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUp, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && isLoaded) {
      fetch("/api/set-user-role", { method: "POST" })
        .then(() => {
          window.location.href = '/dashboard?refresh=' + Date.now();
        })
        .catch(console.error);
    }
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-lg rounded-xl",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
            footerActionLink: "text-purple-600 hover:text-purple-700",
          },
        }}
      />
    </div>
  );
}