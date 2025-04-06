// app/sign-in/page.tsx
import AuthenticationLayout from "@/app/(auth)/layout";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <AuthenticationLayout>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: '#2563eb',
            colorText: '#1f2937',
            colorTextSecondary: '#4b5563',
            colorBackground: '#ffffff',
          },
          elements: {
            rootBox: 'w-full',
            card: 'shadow-none border-0 w-full',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case h-11',
            formFieldInput: 'focus:ring-2 focus:ring-blue-500',
            footerActionLink: 'text-blue-600 hover:text-blue-700 text-sm',
            socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
          }
        }}
        afterSignInUrl="/dashboard"
      />
    </AuthenticationLayout>
  );
}