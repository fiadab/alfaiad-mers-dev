import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { UserProfileWithAppliedJobs } from "@/types/userProfile";
import { redirect } from "next/navigation";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  // Fetch job details
  const job = await db.job.findUnique({
    where: { id: params.jobId },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) redirect("/search");

  // Fetch user profile
  const profile = await db.userProfile.findUnique({
    where: { userId: userId as string },
    include: {
      resumes: { orderBy: { createdAt: "desc" } },
      appliedJobs: {
        include: { job: true }
      },
    },
  });

  if (!profile) redirect("/login");

  // Handle null values
  const safeProfile = {
    ...profile,
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    contact: profile.contact ?? "",
  };

  // Check application status
  const hasApplied = safeProfile.appliedJobs.some(
    appliedJob => appliedJob.job.id === job.id
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Company Information</h2>
        <p>{job.company?.name}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Job Description</h2>
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      {hasApplied ? (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700">✓ You've already applied for this position</p>
        </div>
      ) : (
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-700">Apply for this position</p>
        </div>
      )}

      {safeProfile.fullName && (
        <div className="mt-4">
          <p>Applicant Name: {safeProfile.fullName}</p>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;