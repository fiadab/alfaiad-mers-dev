import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Attachment } from "@prisma/client";

export const DELETE = async (req: Request, { params }: { params: { jobId: string } }) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    // التحقق من صلاحية المستخدم
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // التحقق من وجود jobId
    if (!jobId) {
      return new NextResponse("Bad Request: Job ID is missing", { status: 400 });
    }

    // البحث عن الوظيفة
    const job = await db.job.findUnique({
      where: { id: jobId, userId },
      include: { attachments: true },
    });

    if (!job) {
      return new NextResponse("Not Found: Job not found or not authorized", { status: 404 });
    }

    // حذف الصورة من Edge Store إذا كانت موجودة
    if (job.imageUrl) {
      await deleteFromEdgeStore(job.imageUrl, "image");
    }

    // حذف المرفقات من Edge Store إذا كانت موجودة
    if (job.attachments.length > 0) {
      await Promise.all(
        job.attachments.map((attachment: Attachment) =>
          deleteFromEdgeStore(attachment.url, "attachment")
        )
      );
    }

    // حذف المرفقات من قاعدة البيانات
    await db.attachment.deleteMany({
      where: { jobId },
    });

    // حذف الوظيفة من قاعدة البيانات
    const deletedJob = await db.job.delete({
      where: { id: jobId, userId },
    });

    return NextResponse.json(deletedJob, { status: 200 });
  } catch (error) {
    console.error(`[JOB_DELETE_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// دالة لحذف الملفات من Edge Store
async function deleteFromEdgeStore(filePath: string, type: "image" | "attachment") {
  try {
    const apiUrl =
      type === "image"
        ? "https://dashboard.edgestore.dev/projects/kuqxpiqhkvv850s0/buckets/kl2uw7bp56ywfs84"
        : "https://files.edgestore.dev/myProtectedFiles/";

    const { error: storageError } = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({ filePath: filePath.replace(/^public\//, "") }),
    }).then((res) => res.json());

    if (storageError) {
      throw new Error(storageError);
    }
  } catch (error) {
    console.error(`[DELETE_FROM_EDGE_STORE_${type.toUpperCase()}]:`, error);
    throw new Error(`Failed to delete ${type} from Edge Store`);
  }
}