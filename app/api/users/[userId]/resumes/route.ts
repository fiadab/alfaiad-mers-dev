import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    // التحقق من صلاحية المستخدم
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // استخراج البيانات من الطلب
    const { resumes } = await req.json();

    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return new NextResponse("Bad Request: Invalid resume format", { status: 400 });
    }

    // التحقق من صحة الحقول لكل سيرة ذاتية
    for (const resume of resumes) {
      if (!resume.url || !resume.name) {
        return new NextResponse("Bad Request: Each resume must have a 'url' and 'name'", { status: 400 });
      }
    }

    // جلب السير الذاتية الموجودة مسبقًا
    const existingResumes = await db.resumes.findMany({
      where: {
        userProfileId: userId,
        url: { in: resumes.map((resume) => resume.url) },
      },
    });

    const existingUrls = new Set(existingResumes.map((resume) => resume.url));

    // إنشاء السير الذاتية الجديدة فقط
    const createdResumes: Resumes[] = [];
    for (const resume of resumes) {
      if (existingUrls.has(resume.url)) {
        console.log(`Resume with URL ${resume.url} already exists for userId ${userId}`);
        continue;
      }

      const createdResume = await db.resumes.create({
        data: {
          url: resume.url,
          name: resume.name,
          userProfileId: userId,
        },
      });

      createdResumes.push(createdResume);
    }

    return NextResponse.json(createdResumes, { status: 201 });
  } catch (error) {
    console.error(`[USER_RESUME_POST_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};