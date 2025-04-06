import { ReactNode } from 'react';

const AuthenticationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Main Content */}
        <main className="w-full max-w-md space-y-6 py-8">
          {/* Header Section */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to JobPortal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with amazing opportunities
            </p>
          </div>

          {/* Auth Components Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </main>

        {/* Footer Links */}
        <footer className="absolute bottom-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
              Privacy Policy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthenticationLayout;