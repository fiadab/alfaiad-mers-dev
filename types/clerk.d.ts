// types/clerk.d.ts
declare module '@clerk/types' {
  interface UserPublicMetadata {
    role?: 'admin' | 'user';
    lastActive?: string;
  }

  interface SessionClaims {
    metadata: {
      role?: string;
    }
  }
}