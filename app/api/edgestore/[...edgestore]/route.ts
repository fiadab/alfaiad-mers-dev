
// app/api/edgestore/[...edgestore]/route.ts

import { initEdgeStore } from "@edgestore/server";
import { CreateContextOptions, createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // Implement your auth logic here
  return {
    userId: "123",
    userRole: "admin",
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es.imageBucket({
    maxSize: 1024 * 1024 * 5, // 1MB
  })
  .input(z.object({ type: z.enum(["post", "profile"]) }))
  .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es.fileBucket()
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        { userId: { path: "owner" } },
        { userRole: { eq: "admin" } }
      ]
    })
    .metadata(({ ctx }) => ({
      userId: ctx.userId,
      role: ctx.userRole
    }))
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;


// import { initEdgeStore } from '@edgestore/server';
// import { CreateContextOptions, createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
// import { z } from 'zod';
// import { auth } from '@clerk/nextjs/server';

// type Context = {
//   userId: string;
//   userRole: 'admin' | 'user';
// };

// function createContext({ req }: CreateContextOptions): Context {
//   const { userId, sessionClaims } = auth();
//   return {
//     userId: userId || 'unauthorized',
//     userRole: (sessionClaims?.metadata.role as 'admin' | 'user') || 'user',
//   };
// }

// const es = initEdgeStore.context<Context>().create();

// export const edgeStoreRouter = es.router({
//   myPublicImages: es.imageBucket({
//     maxSize: 5 * 1024 * 1024, // 5 ميجابايت
//   })
//   .input(z.object({ type: z.enum(['post', 'profile']) }))
//   .path(({ input }) => [{ type: input.type }]),

//   myProtectedFiles: es
//     .fileBucket()
//     .path(({ ctx }) => [{ owner: ctx.userId }])
//     .accessControl({
//       OR: [
//         { userId: { path: 'owner' } },
//         { userRole: { eq: 'admin' } },
//       ],
//     })
//     .metadata(({ ctx }) => ({
//       userId: ctx.userId,
//       role: ctx.userRole,
//     })),
// });

// export type EdgeStoreRouter = typeof edgeStoreRouter;

// const handler = createEdgeStoreNextHandler({
//   router: edgeStoreRouter,
//   createContext,
// });

// export { handler as GET, handler as POST };
