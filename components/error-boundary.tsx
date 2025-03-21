"use client";

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function Fallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700">
      <h2 className="text-xl font-bold">An error occurred:</h2>
      <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ReactErrorBoundary>
  );
}