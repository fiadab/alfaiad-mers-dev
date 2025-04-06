// app/profile/page.tsx
'use server';

import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { truncate } from "lodash";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ErrorBoundary from "@/components/error-boundary";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppliedJobsColumns, columns } from "./_components/column";
import { ContactForm } from "./_components/contact-form";
import { EmailForm } from "./_components/email-form";
import { NameForm } from "./_components/name-form";
import { ResumeForm } from "./_components/resume-form";

const ProfilePage = async () => {
  try {
    // Authentication
    const { userId } = auth();
    const user = await currentUser();

    // Redirect unauthenticated users
    if (!userId || !user) {
      redirect(`/sign-in?redirect_url=${encodeURIComponent('/profile')}`);
    }

    // Authorization check
    const role = (user.publicMetadata.role as 'admin' | 'user') ?? 'user';
    if (role !== 'admin') {
      redirect('/unauthorized?code=403');
    }

    // Parallel data fetching with error handling
    const [
      jobsData,
      categoriesData,
      companiesData,
      profileData,
      followedCompaniesData
    ] = await Promise.allSettled([
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

    // Handle data errors
    if (jobsData.status === 'rejected') throw new Error('Failed to load jobs');
    if (profileData.status === 'rejected') throw new Error('Profile load failed');
    
    const { jobs } = jobsData.value;
    const profile = profileData.value;

    // Redirect if profile not completed
    if (!profile) {
      redirect('/complete-profile');
    }

    // Process applied jobs data
    const appliedJobs = profile.appliedJobs || [];
    const formattedJobs: AppliedJobsColumns[] = jobs
      .filter(job => appliedJobs.some(appliedJob => appliedJob.jobId === job.id))
      .map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || "Unspecified Company",
        category: job.category?.name || "General",
        appliedAt: job.appliedJobs?.[0]?.appliedAt
          ? format(new Date(job.appliedJobs[0].appliedAt), "MMM do, yyyy")
          : "Not Available",
      }));

    // Process followed companies data
    const followedCompanies = followedCompaniesData.status === 'fulfilled' 
      ? followedCompaniesData.value 
      : [];

    return (
      <ErrorBoundary>
        <div className="flex-col p-4 md:p-8 items-center justify-center flex">
          <Box>
            <CustomBreadCrumb breadCrumbPage="My Profile" />
          </Box>

          {/* Profile Section */}
          <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
            {user?.hasImage && (
              <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
                <Image
                  fill
                  className="w-full h-full object-cover"
                  alt="Profile Picture"
                  src={user.imageUrl}
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}

            <NameForm initialData={profile} userId={userId} />
            <EmailForm initialData={profile} userId={userId} />
            <ContactForm initialData={profile} userId={userId} />
            <ResumeForm initialData={profile} userId={userId} />
          </Box>

          {/* Applied Jobs Section */}
          <Box className="flex-col items-start justify-start mt-12 w-full">
            <h2 className="text-2xl text-muted-foreground font-semibold mb-6">
              Applied Jobs
            </h2>
            <DataTable
              columns={columns}
              searchKey="company"
              data={formattedJobs}
              noDataMessage="No applications found"
            />
          </Box>

          {/* Followed Companies Section */}
          <Box className="flex-col items-start justify-start mt-12 w-full">
            <h2 className="text-2xl text-muted-foreground font-semibold mb-6">
              Followed Companies
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-4">
              {followedCompanies.length === 0 ? (
                <p className="text-muted-foreground">No followed companies</p>
              ) : (
                followedCompanies.map((company) => (
                  <Card className="p-4 space-y-3 relative hover:shadow-lg transition-shadow" key={company.id}>
                    <div className="absolute top-2 right-2">
                      <Link href={`/companies/${company.id}`} passHref>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          aria-label="View company details"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                    
                    {company.logo && (
                      <div className="w-full h-32 relative mb-4">
                        <Image
                          fill
                          alt="Company Logo"
                          src={company.logo}
                          className="object-contain"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    
                    <CardTitle className="text-lg font-semibold">
                      {company.name || "Unnamed Company"}
                    </CardTitle>
                    
                    {company.description && (
                      <CardDescription className="line-clamp-3">
                        {truncate(company.description, {
                          length: 100,
                          omission: "...",
                        })}
                      </CardDescription>
                    )}
                  </Card>
                ))
              )}
            </div>
          </Box>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('ProfilePage Error:', error);
    const digest = (error as any)?.digest || Math.random().toString(36).substring(2, 15);
    redirect(`/error?source=profile&digest=${digest}`);
  }
};

export default ProfilePage;