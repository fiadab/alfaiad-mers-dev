// app/error/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Global error page component
 * Handles display of various error types with dynamic messages
 */
export default function ErrorPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  // Error code to message mapping
  const errorMessages: { [key: string]: string } = {
    MIDDLEWARE_ERROR: "Routing system error",
    AUTH_ERROR: "Authentication failure",
    DEFAULT: "Unexpected system error",
  };

  // Get message based on error code
  const message = errorMessages[searchParams.code || ''] || errorMessages.DEFAULT;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full space-y-4 text-center">
        {/* Error header */}
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          System Error
        </h1>
        
        {/* Dynamic error message */}
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button asChild variant="default">
            <Link href="/">Home Page</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Technical Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}