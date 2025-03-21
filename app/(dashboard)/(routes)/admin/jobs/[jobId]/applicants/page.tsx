import { db } from "@/lib/db";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ApplicantColumns } from "./_components/columns";
import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/columns";


const JobApplicantsPage = async (
  { params }: { params: { jobId: string } }
) => {
  const { userId } = await auth();
  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  let profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const filteredProfiles = profiles?.filter((profile) =>
    profile.appliedJobs.some(
      (appliedJob) => appliedJob.jobId === params.jobId
    )
  );

  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map((profile) => ({
    id: profile.userId,
    fullname: profile.fullName ?? "",
    email: profile.email ?? "",
    contact: profile.contact ?? "",
    appliedAt: profile.appliedJobs.find((job) => job.jobId === params.jobId)
      ?.appliedAt
      ? format(
          new Date(
            profile.appliedJobs.find((job) => job.jobId === params.jobId)
              ?.appliedAt ?? ""
          ),
          "MMM do, yyyy"
        )
      : "",
    resume: profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ?? "",
    resumeName: profile.resumes.find((res) => res.id === profile.activeResumeId)?.name ?? "",
  }));

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: `${job ? job.title : ""}` },
          ]}
        />
      </Box>
      <div className="mt-6 w-full">
        <DataTable
          columns={columns}
          data={formattedProfiles}
          searchKey="fullName"
        />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
