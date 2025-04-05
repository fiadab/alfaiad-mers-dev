// types/edgestore.d.ts
/**
 * Type definition file to separate server-side types
 * from client-side code to prevent import issues
 */
import { edgeStoreRouter } from '@/app/api/edgestore/[...edgestore]/route';

export type EdgeStoreRouter = typeof edgeStoreRouter;