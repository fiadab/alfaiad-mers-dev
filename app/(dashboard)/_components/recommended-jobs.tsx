"use client";
import Box from "@/components/box";
import { Job } from "@prisma/client";
import PageContent from "../(routes)/search/_components/page-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecommendedJobslistProps {
  jobs: Job[];
  userId: string | null;
}

export const RecommendedJobslist = ({ jobs, userId }: RecommendedJobslistProps) => {
  return (
    <Box className="flex-col justify-center gap-y-4 mt-12">
      <h2 className="text-2xl font-semibold tracking-wider font-sans">
        Recommended Jobs
      </h2>
      <div className="mt-4">
        {jobs.length > 0 ? (
          <PageContent jobs={jobs} userId={userId} />
        ) : (
          <p className="text-gray-500">No recommended jobs available at the moment.</p>
        )}
      </div>

      <Link href={"/search"} className="my-8">
        <Button className="w-44 h-12 rounded-xl border border-purple-500 hover:bg-transparent hover:shadow-md text-purple-500 hover:text-purple-600 bg-transparent">
          View All Jobs
        </Button>
      </Link>
    </Box>
  );
};
