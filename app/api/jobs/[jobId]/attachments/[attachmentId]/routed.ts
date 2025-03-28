import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { useEdgeStore } from "@/lib/edgestore";

// PATCH: Update job attachments
export async function PATCH(req: Request) {
  const { edgestore } = useEdgeStore();

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

    const { jobId, attachments } = await req.json();

    // Validate job ownership
    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) return NextResponse.json("Job not found", { status: 404 });

    // Sync with EdgeStore
    const existingAttachments = await db.attachment.findMany({ where: { jobId } });
    const toDelete = existingAttachments.filter(
      (ea) => !attachments.some((a: any) => a.url === ea.url)
    );

    // Delete orphaned attachments
    await Promise.all(
      toDelete.map(async (attachment) => {
        await edgestore.myProtectedFiles.delete({ url: attachment.url });
      })
    );

    // Update database
    await db.$transaction([
      db.attachment.deleteMany({
        where: { id: { in: toDelete.map((d) => d.id) } },
      }),
      db.attachment.createMany({
        data: attachments
          .filter((a: any) => !existingAttachments.some((ea) => ea.url === a.url))
          .map((a: any) => ({ jobId, ...a })), // Ensure `.map` is outside `.filter`
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ATTACHMENTS_PATCH]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
