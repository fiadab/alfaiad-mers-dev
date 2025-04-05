// app/api/edgestore/[...edgestore]/route.ts
import 'server-only';
import { initEdgeStore } from '@edgestore/server';
import { CreateContextOptions, createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// Environment validation
if (!process.env.EDGE_STORE_ACCESS_KEY || !process.env.EDGE_STORE_SECRET_KEY) {
  throw new Error('EdgeStore environment variables not configured');
}

type Context = {
  userId: string;
  userRole: 'admin' | 'user';
};

export function createContext({ req }: CreateContextOptions): Context {
  try {
    const { userId, sessionClaims } = auth();
    return {
      userId: userId || 'unauthorized',
      userRole: (sessionClaims?.metadata?.role as 'admin' | 'user') || 'user',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { userId: 'unauthorized', userRole: 'user' };
  }
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es.imageBucket({
    maxSize: 5 * 1024 * 1024,
  })
  .input(z.object({ type: z.enum(['post', 'profile']) }))
  .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        { userId: { path: 'owner' } },
        { userRole: { eq: 'admin' } },
      ],
    })
    .metadata(({ ctx }) => ({
      userId: ctx.userId,
      role: ctx.userRole,
    }))
    .beforeDelete(async ({ ctx, fileInfo }) => {
      console.log(`Deleting file: ${fileInfo.url} by user ${ctx.userId}`);
      return true;
    }),
});

export type EdgeStoreRouter = typeof edgeStoreRouter;

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };