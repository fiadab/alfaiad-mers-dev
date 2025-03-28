import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobDetailsPageContent } from "./_components/job-details-page-content";
import { UserProfile } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-jobs";
import { Box } from "lucide-react";
import PageContent from "../_components/page-content";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  // Fetch the job details
  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  // Fetch the user profile
  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Fetch all jobs and filter related jobs
  const { jobs } = await getJobs({});
  const filterredJobs = jobs.filter(
    (j) => j.id !== job.id && j.categoryId === job.categoryId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsPageContent job={job} jobId={job.id} userProfile={profile} />

      {filterredJobs && filterredJobs.length > 0 && (
        <>
          <Separator />
          <Box className="flex-col my-4 items-center justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Related Jobs</h2>
          </Box>
          <PageContent jobs={filterredJobs} userId={userId} />
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;