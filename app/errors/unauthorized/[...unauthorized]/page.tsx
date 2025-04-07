// app/unauthorized/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * 403 Forbidden access page
 * Shown when user lacks required permissions
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {/* Access denied header */}
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Access Denied
        </h1>
        
        {/* Explanation message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don&apos;t have required permissions to access this resource
        </p>
        
        {/* Navigation button */}
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button variant="default" size="lg">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}