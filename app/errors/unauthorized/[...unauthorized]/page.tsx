//app/errors/unauthorized/[[...unauthorized]]/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage({ params }: { params: { unauthorized?: string[] } }) {
  console.log(params.unauthorized);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          ⚠️ Not enough permission
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          Sorry, you do not have permission to access this page
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to home page
          </Link>

          <Link
            href="/sign-in"
            className="inline-block w-full border-2 border-blue-600 text-blue-600 py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Log in with another account
          </Link>
        </div>
      </div>
    </div>
  );
}

