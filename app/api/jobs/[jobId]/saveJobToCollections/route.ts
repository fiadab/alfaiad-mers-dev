import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    // التحقق من صلاحية المستخدم
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // التحقق من وجود jobId
    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    // البحث عن الوظيفة
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // تحديث savedUsers
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        savedUsers: {
          push: userId, // إضافة userId إلى savedUsers
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_SAVE_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};