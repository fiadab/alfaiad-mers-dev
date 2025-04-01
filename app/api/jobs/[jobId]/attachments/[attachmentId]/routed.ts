import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEdgeStore } from "@/lib/edgestoreServer";

export async function PATCH(req: Request) {
  const edgestore = getEdgeStore();

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

    const { jobId, attachments } = await req.json();

    // التحقق من ملكية الوظيفة
    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) return NextResponse.json("Job not found", { status: 404 });

    // جلب المرفقات الموجودة من قاعدة البيانات
    const existingAttachments = await db.attachment.findMany({ where: { jobId } });
    const toDelete = existingAttachments.filter(
      (ea) => !attachments.some((a: any) => a.url === ea.url)
    );

    // حذف المرفقات من قاعدة البيانات
    await db.attachment.deleteMany({
      where: { id: { in: toDelete.map((d) => d.id) } },
    });

    // إضافة المرفقات الجديدة إلى قاعدة البيانات
    await db.attachment.createMany({
      data: attachments
        .filter((a: any) => !existingAttachments.some((ea) => ea.url === a.url))
        .map((a: any) => ({ jobId, ...a })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ATTACHMENTS_PATCH]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
