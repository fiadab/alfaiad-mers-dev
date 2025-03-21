import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  ) => {
  try {
        const {userId} = await auth();

        if(!userId) {
          return new NextResponse("Un-Authorized", {status: 401});
        }

    const { resumes } = await req.json();

    if (
      !resumes ||
      !Array.isArray(resumes) ||
      resumes.length === 0
    ) {
      return new NextResponse("Invalid Resume Format", { status: 400 });
    }

    const createdResumes : Resumes [] = [];

    for (const resume of resumes) {
      const { url, name } = resume;


      const  existingResume = await db.resumes.findFirst({
        where:{
          userProfileId: userId,
          url,
        },
      });



      if (existingResume) {
        console.log(
          `Resume with URL ${url} already exists for jobId ${userId}`
        );
        continue;

      }


      const createdResume = await db.resumes.create({
                  data:{
                    url,
                    name,
                    userProfileId: userId,
                  },
      });



       createdResumes.push(createdResume);
    }


    return NextResponse.json(createdResumes);
  } catch (error) {
    console.error(`[USER_RESUME_POST]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
