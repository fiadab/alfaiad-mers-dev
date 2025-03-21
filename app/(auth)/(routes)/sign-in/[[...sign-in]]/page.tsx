"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-lg rounded-2xl",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
            footerActionLink: "text-blue-600 hover:text-blue-700 text-sm",
          },
        }}
        redirectUrl={(searchParams: { get: (arg0: string) => any; }) => {
          // معالجة إعادة التوجيه من Middleware
          const redirectUrl = searchParams.get("redirect_url");
          return redirectUrl || "/dashboard";
        }}
      />
    </div>
  );
}
