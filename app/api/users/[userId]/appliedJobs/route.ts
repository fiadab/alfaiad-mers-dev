import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    // Assuming the jobId is passed as JSON
    const { jobId } = await req.json();

    if (!jobId) {
      return new NextResponse("Job Id Is Missing", { status: 400 });
    }

    // Find the user profile
    let profile = await db.userProfile.findUnique({
      where: {
        userId: userId as string,
      },
    });

    if (!profile) {
      return new NextResponse("User Profile Not Found", { status: 404 });
    }

    // Retrieve existing appliedJobs text (if any)
    const existingAppliedJobs = profile.appliedJobs || '';

    // Append the new jobId to the existing string, using a delimiter (e.g., a comma)
    const updatedAppliedJobs = existingAppliedJobs ? `${existingAppliedJobs},${jobId}` : jobId;

    // Update the profile with the new appliedJobs text
    const updatedProfile = await db.userProfile.update({
      where: {
        userId,
      },
      data: {
        appliedJobs: updatedAppliedJobs,
      },
    });

    return NextResponse.json(updatedProfile);

  } catch (error) {
    console.error(`[JOB_APPLIED_JOBS_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
