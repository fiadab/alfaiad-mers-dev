'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { EdgeStoreProvider } from '../lib/edgestore';
import { ToastProvider } from './toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <EdgeStoreProvider>
        {children}
        <ToastProvider />
      </EdgeStoreProvider>
    </ClerkProvider>
  );
};