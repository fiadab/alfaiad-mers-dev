//app/api/jobs/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
    reg : Request,
     {params} : {params : {jobId : string}}
) => {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const jobs = await db.job.findMany({
            where: { userId },
            include: {
                category: true,
                company: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("[JOBS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};