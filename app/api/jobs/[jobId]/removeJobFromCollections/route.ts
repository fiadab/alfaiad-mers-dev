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

    // التحقق مما إذا كان userId موجودًا في savedUsers
    const userIndex = job.savedUsers.indexOf(userId);
    if (userIndex === -1) {
      return new NextResponse("User not found in savedUsers", { status: 404 });
    }

    // تحديث savedUsers بإزالة userId
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        savedUsers: {
          set: job.savedUsers.filter((savedUserId) => savedUserId !== userId),
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_REMOVE_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};