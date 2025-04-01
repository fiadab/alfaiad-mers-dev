import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "@/types/userProfile";
import { redirect } from "next/navigation";
import { useMemo } from "react";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  // Fetch job with company details
  const job = await db.job.findUnique({
    where: { id: params.jobId },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) redirect("/search");

  // Fetch user profile with relationships
  const profile = await db.userProfile.findUnique({
    where: { userId: userId as string },
    include: {
      resumes: { orderBy: { createdAt: "desc" } },
      appliedJobs: {
        include: {
          job: {
            include: {
              company: true // Include company in job relation
            }
          }
        }
      },
    },
  }) as UserProfile | null; // Type assertion

  if (!profile) redirect("/login");

  // Safe profile data with defaults
  const safeProfile = {
    ...profile,
    fullName: profile.fullName || "",
    email: profile.email || "",
    contact: profile.contact || "",
    appliedJobs: profile.appliedJobs || [], // Default empty array
  };

  // Memoized application check
  const hasApplied = useMemo(
    () => safeProfile.appliedJobs.some(
      (appliedJob) => appliedJob.job.id === job.id
    ),
    [safeProfile.appliedJobs, job.id]
  );

  return (
    <div className="flex-col p-4 md:p-8">
      {/* Application status indicator */}
      {hasApplied && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700">✓ You've applied for this position</p>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;