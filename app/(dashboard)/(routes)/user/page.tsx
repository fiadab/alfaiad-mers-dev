// Force dynamic rendering to avoid static generation errors due to dynamic server usage.
export const dynamic = 'force-dynamic';

import { getJobs } from "@/actions/get-jobs";
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
import ErrorBoundary from "@/components/error-boundary";

const ProfilePage = async () => {
  try {
    // Authentication and authorization checks
    const { userId } = await auth();
    const user = await currentUser();

    // Redirect unauthenticated/unauthorized users
    if (!userId || !user) redirect('/sign-in');
    if (user.publicMetadata.role !== 'admin') redirect('/unauthorized');

    // Parallel data fetching
    const [
      { jobs },
      categories,
      companies,
      profile,
      followedCompanies
    ] = await Promise.all([
      getJobs({ userId }),
      db.category.findMany({ orderBy: { name: "asc" } }),
      db.company.findMany({ orderBy: { createdAt: "desc" } }),
      db.userProfile.findUnique({
        where: { userId },
        include: {
          resumes: { orderBy: { createdAt: "desc" } },
          appliedJobs: true
        }
      }),
      db.company.findMany({
        where: { followers: { has: userId } },
        orderBy: { createdAt: "desc" }
      })
    ]);

    // Handle incomplete profile
    if (!profile) redirect('/complete-profile');

    // Process applied jobs
    const appliedJobs = profile.appliedJobs || [];
    const filteredAppliedJobs = jobs.filter(job =>
      appliedJobs.some(appliedJob => appliedJob.jobId === job.id)
    );

    // Format jobs data for table
    const formattedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "Unspecified Company",
      category: job.category?.name || "General",
      appliedAt: job.appliedJobs?.[0]?.appliedAt
        ? format(new Date(job.appliedJobs[0].appliedAt), "MMM do, yyyy")
        : "Not Available",
    }));

    return (
      <ErrorBoundary>
        <div className="flex-col p-4 md:p-8 items-center justify-center flex">
          {/* Profile Header */}
          <Box>
            <CustomBreadCrumb breadCrumbPage="My Profile" />
          </Box>

          {/* Profile Details Section */}
          <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
            {user?.hasImage && (
              <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
                <Image
                  fill
                  className="w-full h-full object-cover"
                  alt="Profile Picture"
                  src={user.imageUrl}
                  priority
                />
              </div>
            )}

            {/* Profile Update Forms */}
            <NameForm initialData={profile} userId={userId} />
            <EmailForm initialData={profile} userId={userId} />
            <ContactForm initialData={profile} userId={userId} />
            <ResumeForm initialData={profile} userId={userId} />
          </Box>

          {/* Applied Jobs Table */}
          <Box className="flex-col items-start justify-start mt-12">
            <h2 className="text-2xl text-muted-foreground font-semibold">
              Applied Jobs
            </h2>
            <div className="w-full mt-6">
              <DataTable
                columns={columns}
                searchKey="company"
                data={formattedJobs}
                noDataMessage="No applications found"
              />
            </div>
          </Box>

          {/* Followed Companies Grid */}
          <Box className="flex-col items-start justify-start mt-12">
            <h2 className="text-2xl text-muted-foreground font-semibold">
              Followed Companies
            </h2>
            <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
              {followedCompanies.length === 0 ? (
                <p className="text-muted-foreground">No followed companies</p>
              ) : (
                <>
                  {followedCompanies.map((company) => (
                    <Card className="p-3 space-y-2 relative" key={company.id}>
                      <div className="w-full flex items-center justify-end">
                        <Link
                          href={`/companies/${company.id}`}
                          aria-label="View company details"
                        >
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      {company.logo && (
                        <div className="w-full h-24 flex items-center justify-center relative overflow-hidden">
                          <Image
                            fill
                            alt="Company Logo"
                            src={company.logo}
                            className="object-contain w-full h-full"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardTitle className="text-lg">
                        {company.name || "Unnamed Company"}
                      </CardTitle>
                      {company.description && (
                        <CardDescription>
                          {truncate(company.description, {
                            length: 80,
                            omission: "...",
                          })}
                        </CardDescription>
                      )}
                    </Card>
                  ))}
                </>
              )}
            </div>
          </Box>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('ProfilePage Error:', error);
    let digest = '';

    if (error instanceof Error) {
      digest = (error as any).digest || '';
    }

    redirect(`/error?source=dashboard&digest=${digest}`);
  }
};

export default ProfilePage;
