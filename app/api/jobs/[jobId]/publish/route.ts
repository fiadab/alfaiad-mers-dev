// publish.ts
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.userId !== userId) {
      return new NextResponse("Job not found or unauthorized", { status: 404 });
    }

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: { isPublished: !job.isPublished },
    });

    console.log("Updated Job:", updatedJob);
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_PUBLISH_PATCH]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};