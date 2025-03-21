import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    // التحقق من الهوية والصحة
    const { userId } = await auth();
    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

    const { jobId } = params;
    if (!jobId) return NextResponse.json("Job ID required", { status: 400 });

    // تحقق من صحة البيانات المدخلة
    const requestBody = await req.json();
    if (!requestBody || Object.keys(requestBody).length === 0) {
      return NextResponse.json("No update data provided", { status: 400 });
    }

    // التحقق من وجود الوظيفة
    const existingJob = await db.job.findUnique({
      where: { id: jobId, userId }
    });
    if (!existingJob) return NextResponse.json("Job not found", { status: 404 });

    // التحديث الآمن مع التحقق من الحقول
    const { imageUrl, ...otherUpdates } = requestBody;

    const updateData = {
      ...(imageUrl && { imageUrl }), // تحديث الصورة فقط إذا وجدت
      ...otherUpdates // باقي التحديثات
    };

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: updateData,
      select: { // تحديد الحقول المراد إرجاعها
        id: true,
        title: true,
        imageUrl: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedJob, { status: 200 });

  } catch (error) {
    console.error("[JOB_UPDATE_ERROR]", error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};