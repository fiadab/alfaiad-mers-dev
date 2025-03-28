import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import Image from "next/image";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { db } from "@/lib/db";
import { EmailForm } from "./_components/email-form";
import { ContactForm } from "./_components/contact-form";
import { ResumeForm } from "./_components/resume-form";
import { DataTable } from "@/components/ui/data-table";
import { AppliedJobsColumns, columns } from "./_components/column";
import { format } from "date-fns";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { truncate } from "lodash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  // Fetch authenticated user
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect to sign-in page if user is not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user profile
  const profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Fetch jobs created by the user
  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter and format applied jobs
  const filteredAppliedJobs =
    profile && profile?.appliedJobs.length > 0
      ? jobs
          .filter((job) =>
            profile.appliedJobs.some(
              (appliedJob) => appliedJob.jobId === job.id
            )
          )
          .map((job) => ({
            ...job,
            appliedAt: profile.appliedJobs.find(
              (appliedJob) => appliedJob.jobId === job.id
            )?.appliedAt,
          }))
      : [];

  const formattedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : "",
    category: job.category ? job.category?.name : "",
    appliedAt: job.appliedAt
      ? format(new Date(job.appliedAt), "MMM do, yyyy")
      : "",
  }));

  // Fetch followed companies
  const followedCompanies = await db.company.findMany({
    where: {
      followers: {
        has: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      {/* Breadcrumb */}
      <Box>
        <CustomBreadCrumb breadCrumbPage="My Profile" />
      </Box>

      {/* Profile Information */}
      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
            <Image
              fill
              className="w-full h-full object-cover"
              alt="Profile Picture"
              src={user.imageUrl}
            />
          </div>
        )}

        {/* Forms for updating profile */}
        <NameForm initialData={profile} userId={userId} />
        <EmailForm initialData={profile} userId={userId} />
        <ContactForm initialData={profile} userId={userId} />
        <ResumeForm initialData={profile} userId={userId} />
      </Box>

      {/* Applied Jobs List Table */}
      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Applied Jobs
        </h2>

        <div className="w-full mt-6">
          <DataTable
            columns={columns}
            searchKey="company"
            data={formattedJobs}
          />
        </div>
      </Box>

      {/* Followed Companies */}
      <Box className="flex-col items-start justify-start mt-12">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Followed Companies
        </h2>
        <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
          {followedCompanies.length === 0 ? (
            <p>No Companies Followed Yet</p>
          ) : (
            <React.Fragment>
              {followedCompanies.map((com) => (
                <Card className="p-3 space-y-2 relative" key={com.id}>
                  <div className="w-full flex items-center justify-end">
                    <Link href={`/companies/${com.id}`}>
                      <Button variant={"ghost"} size={"icon"}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  {com.logo && (
                    <div className="w-full h-24 flex items-center justify-self-center relative overflow-hidden">
                      <Image
                        fill
                        alt="Logo"
                        src={com.logo}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <CardTitle className="text-lg">{com?.name}</CardTitle>
                  {com.description && (
                    <CardDescription>
                      {truncate(com?.description, {
                        length: 80,
                        omission: "...",
                      })}
                    </CardDescription>
                  )}
                </Card>
              ))}
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;