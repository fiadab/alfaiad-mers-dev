import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    // استخراج jobId من جسم الطلب (JSON)
    const { jobId } = await req.json();
    if (!jobId) {
      return new NextResponse("Job Id Is Missing", { status: 400 });
    }

    // البحث عن ملف تعريف المستخدم
    const profile = await db.userProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        appliedJobs: true, // تأكد من جلب قائمة الوظائف المتقدمة
      },
    });

    if (!profile) {
      return new NextResponse("User Profile Not Found", { status: 404 });
    }

    // التأكد من عدم تكرار تقديم نفس الوظيفة
    const alreadyApplied = profile.appliedJobs.some((job) => job.jobId === jobId);
    if (alreadyApplied) {
      return new NextResponse("Conflict: User has already applied for this job", { status: 409 });
    }

    // تحديث قائمة الوظائف المتقدمة
    const updatedProfile = await db.userProfile.update({
      where: { id: profile.id },
      data: {
        appliedJobs: {
          push: { jobId, appliedAt: new Date() }, // إضافة الوظيفة إلى المصفوفة
        },
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error(`[JOB_APPLIED_JOBS_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};




// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const PATCH = async (req: Request) => {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
//     }

//     // استخراج jobId من جسم الطلب (JSON)
//     const { jobId } = await req.json();
//     if (!jobId) {
//       return new NextResponse("Bad Request: Job ID is missing", { status: 400 });
//     }

//     // البحث عن ملف تعريف المستخدم
//     const profile = await db.userProfile.findUnique({
//       where: { userId },
//       select: {
//         id: true,
//       },
//     });

//     if (!profile) {
//       return new NextResponse("User Profile Not Found", { status: 404 });
//     }

//     // التحقق مما إذا كان المستخدم قد تقدم بالفعل لهذه الوظيفة
//     const alreadyApplied = await db.appliedJob.findFirst({
//       where: {
//         jobId,
//         userProfileId: profile.id,
//       },
//     });

//     if (alreadyApplied) {
//       return new NextResponse("Conflict: User has already applied for this job", { status: 409 });
//     }

//     // إضافة الوظيفة إلى قائمة الوظائف التي تم التقديم عليها
//     const appliedJob = await db.appliedJob.create({
//       data: {
//         jobId,
//         userProfileId: profile.id,
//         appliedAt: new Date(),
//       },
//     });

//     return NextResponse.json(appliedJob, { status: 201 });
//   } catch (error) {
//     console.error(`[JOB_APPLIED_JOBS_PATCH_ERROR]:`, error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };