import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {

    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    const { resumeId } = await req.json();

    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });


    if (!resume || resume.userProfileId !== userId) {
      return new NextResponse("Resume not found or not authorized", { status: 404 });
    }


    await db.resumes.delete({
      where: { id: resumeId },
    });

    return new NextResponse("Resume deleted successfully", { status: 200 });
  } catch (error) {

    console.error(`[USER_RESUME_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

