import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }


    const values = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No data provided", { status: 400 });
    }

    let userProfile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (userProfile) {

      userProfile = await db.userProfile.update({
        where: { userId },
        data: { ...values },
      });
    } else {

      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);

  } catch (error) {
    console.error(`[USER_PROFILE_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
