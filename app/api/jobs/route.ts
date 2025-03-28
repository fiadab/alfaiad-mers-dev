import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title || title.length < 3) {
      return new NextResponse("Invalid title", { status: 400 });
    }

    const job = await db.job.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("[JOB_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};