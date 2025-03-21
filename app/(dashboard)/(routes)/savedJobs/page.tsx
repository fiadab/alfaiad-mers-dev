// SavedJobsPage.tsx
import { getJobs } from "@/actions/get-jobs"; 
import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { SearchContainer } from "@/components/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageContent from "../search/_components/page-content";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  };
}

const SavedJobsPage = async ({ searchParams }: SearchProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // الحصول على الوظائف
  const result = await getJobs({ ...searchParams, savedJobs: true });

  // استخلاص المصفوفة فقط من الكائن
  const jobs = result.jobs;

  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb breadCrumbPage="Saved Jobs" />
      </Box>
      <Box className="w-full h-44 bg-black justify-center">
        <h2 className="text-white font-sans uppercase text-3xl tracking-wider font-bold">
          Saved Jobs
        </h2>
      </Box>
      <div className="px-6 pt-6 md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
};

export default SavedJobsPage;
