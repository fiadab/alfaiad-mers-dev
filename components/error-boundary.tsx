"use client";

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg my-4">
      <h2 className="text-xl font-bold">⚠️ Application Error</h2>
      <p className="mt-2 text-sm">Error Digest: {(error as any).digest}</p>
      <pre className="mt-2 text-xs whitespace-pre-wrap font-mono p-2 bg-red-50 rounded">
        {error.message}
      </pre>
    </div>
  );
}

export default function ErrorBoundary({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error('Error Boundary Caught:', error);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}