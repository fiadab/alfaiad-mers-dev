import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Building2, File, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/job-publish-actons";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { YearsOfExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
import { TagsForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({params} : {params : {jobId : string}}) => {
   //  verfiy the mangodb Id
   const validObjectIdReqex =  /^[0-9a-fA-F]{24}$/;
   if(!validObjectIdReqex.test(params.jobId)){
    return  redirect("/admin/jobs");
   }
      const { userId } = await auth();

      if(!userId) {
        return redirect("/");
      }
      const job = await db.job.findUnique({
        where :{
            id : params.jobId,
            userId,
        },
        include: {
          attachments: {
            orderBy: {
              createdAt: "desc"
            },
          },
        },
      });

      const categories = await db.category.findMany({
        orderBy : {name : "asc"},
      });

      const companies = await db.company.findMany({
        where:{
          userId,
        },
        orderBy:{
          createdAt: "desc",
        },
       });

if(!job){
    return redirect("/admin/jobs");
}
     const requiredFields =[
      job.title,
      job.description,
      job.imageUrl,
      job.categoryId,
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);


     return (
     <div className="p-6">
        <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
            <ArrowLeft className="w-4 h-4"/>
            Back
        </div>
        </Link>
         {/* title */}
       <div className="flex items-center justify-between my-4">
         <div className="flex flex-col gap-y-2">
             <h1 className="text-2xl font-medium">Job Setup</h1>
              <span  className="text-sm text-neutral-500">
                Complete All fields {completionText}
         </span>
         </div>
       {/* action button */}
        <JobPublishAction
        jobId={params.jobId}
        isPublished={job.isPublished }
        disabled={!isComplete}
        />
        </div>

      {/* Warning before publishing */}

      {!job.isPublished  && (
        <Banner
        variant = {"warning"}
        label = " This Job Is Unpublish. It Will Not Be Visible In The Jobs List"
        />
      )}

       {/* container layout */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Container */}
         <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge
            icon={LayoutDashboard}
            />
            <h2 className="text-xl text-neutral-700">Customize Your Job </h2>
          </div>



          {/* title form */}
        <TitleForm
        initialData={job}
        jobId={job.id}
        />

        {/* Category Form */}
        <CategoryForm
        initialData={job}
        jobId={job.id}
        options={categories.map(category =>({
        label: category.name,
        value: category.id,
        }))}
        />

        {/* Cover Image */}
        <ImageForm
        initialData={job}
        jobId={job.id}
         />

        {/* Short Description */}
        <ShortDescription
        initialData={job}
        jobId={job.id}
        />

        {/* Shift Timing */}
        <ShiftTimingForm
             initialData={job}
             jobId={job.id}
             />

          {/* Hourly Rate */}
          <HourlyRateForm
        initialData={job}
        jobId={job.id}
        />

         {/* Work Mode */}
         <WorkModeForm
             initialData={job}
             jobId={job.id}/>

              {/* Years Of Experience */}
         <YearsOfExperienceForm
             initialData={job}
             jobId={job.id}/>
         </div>

         {/* Right Container */}
           <div className="space-y-6">
            <div>
              <div className="flex item-center gap-x-2">
                <IconBadge icon={ListChecks}/>
                <h2 className="text-xl text-neutral-700">Job Requirements</h2>
              </div>
              <TagsForm
              initialData={job}
              jobId={job.id}
              />
             </div>


            {/* Company Details  */}
             <div>
              <div className="flex item-center gap-x-2">
                <IconBadge icon={Building2}/>
                <h2 className="text-xl text-neutral-700">Company Details</h2>
              </div>
            {/* Company Details Form */}
                  <CompanyForm
                  initialData={job}
                  jobId={job.id}
                  options={categories.map(category =>({
                  label: category.name,
                   value: category.id,
               }))}
              />
             </div>


             {/* Attachments */}
             <div>
              <div className="flex item-center gap-x-2">
                <IconBadge icon={File}/>
                <h2 className="text-xl text-neutral-700">Job Attachments</h2>
              </div>
             {/* Attachments Details */}
           <AttachmentsForm
           initialData={job}
           jobId={job.id}
           />
             </div>
             </div>
         {/* Description */}
         <div className="col-span-2">
          <JobDescription
          initialData={job}
          jobId={job.id}
          />
         </div>
       </div>
      </div>
);
};

export default JobDetailsPage;