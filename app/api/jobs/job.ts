// app/api/jobs/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch jobs with related data
    const jobs = await db.job.findMany({
      where: { userId }, // Filter by current user
      include: {
        category: { select: { name: true } },
        company: { select: { name: true } },
        appliedJobs: true // Include applications count
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[JOBS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};