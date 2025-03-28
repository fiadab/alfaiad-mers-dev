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
  
  // استعلام للحصول على الوظيفة المرتبطة بالمستخدم
  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  // استعلام للحصول على جميع الـ profiles مع تضمين appliedJobs و resumes
  let profiles = await db.userProfile.findMany({
    include: {
      appliedJobs: {  // تضمين appliedJobs
        include: {
          job: true, // تضمين job المرتبطة بـ appliedJob
        },
      },
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // فلترة الـ profiles بناءً على الـ jobId
  const filteredProfiles = profiles.filter((profile) =>
    profile.appliedJobs.some(
      (appliedJob) => appliedJob.jobId === params.jobId
    )
  );

  // تنسيق الـ profiles ليتم عرضها في الجدول
  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map((profile) => {
    // البحث عن appliedJob المرتبط بالـ jobId
    const appliedJob = profile.appliedJobs.find((job) => job.jobId === params.jobId);
    // البحث عن الـ resume المرتبط بالـ activeResumeId
    const resume = profile.resumes.find((res) => res.id === profile.activeResumeId);

    return {
      id: profile.userId,
      fullname: profile.fullName ?? "",
      email: profile.email ?? "",
      contact: profile.contact ?? "",
      appliedAt: appliedJob
        ? format(new Date(appliedJob.appliedAt ?? ""), "MMM do, yyyy")
        : "",
      resume: resume?.url ?? "",
      resumeName: resume?.name ?? "",
    };
  });

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
