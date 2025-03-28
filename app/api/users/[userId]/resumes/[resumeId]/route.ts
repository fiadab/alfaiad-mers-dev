import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    const { userId } = await auth();

    // التحقق من صلاحية المستخدم
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // استخراج resumeId من الطلب
    const { resumeId } = await req.json();

    if (!resumeId) {
      return new NextResponse("Bad Request: Resume ID is missing", { status: 400 });
    }

    // البحث عن السيرة الذاتية
    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });

    // التحقق من وجود السيرة الذاتية وصلاحية المستخدم
    if (!resume || resume.userProfileId !== userId) {
      return new NextResponse("Not Found: Resume not found or not authorized", { status: 404 });
    }

    // حذف السيرة الذاتية
    await db.resumes.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`[USER_RESUME_DELETE_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};