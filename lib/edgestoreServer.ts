import { EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";
import { initEdgeStore } from "@edgestore/server";

// تمرير النوع EdgeStoreRouter لضمان توافقه مع TypeScript
export const getEdgeStore = () => {
  return initEdgeStore.context().create() as unknown as EdgeStoreRouter;
};
 