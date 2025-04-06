// app/errors/unauthorized/[[...unauthorized]]/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function UnauthorizedPage({
  params,
}: {
  params: { unauthorized?: string[] };
}) {
  const { userId } = auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Unauthorized params:', params.unauthorized);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <div className="flex justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            Access Restricted
          </h1>
        </div>

        {/* التعديل هنا: استبدال ' بـ &apos; */}
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
          You don&apos;t have permission to view this page. Please contact your
          administrator or try signing in with a different account.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Return to home page"
          >
            Home Page
          </Link>

          <Link
            href="/sign-in"
            className="block w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            aria-label="Sign in with different account"
          >
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}