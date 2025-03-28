import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
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
      where: { id: jobId },
    });

    // التحقق من وجود الوظيفة وصلاحية المستخدم
    if (!job) {
      return new NextResponse("Not Found: Job does not exist", { status: 404 });
    }

    if (job.userId !== userId) {
      return new NextResponse("Forbidden: You are not authorized to update this job", { status: 403 });
    }

    // تحديث حالة النشر
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: { isPublished: !job.isPublished },
    });

    console.log("Updated Job:", updatedJob);
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_PUBLISH_PATCH_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};