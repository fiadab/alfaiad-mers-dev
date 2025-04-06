// app/profile/page.tsx
'use server';

import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
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

// تعريف النوع لـ publicMetadata
declare global {
  namespace Clerk {
    interface PublicMetadata {
      role?: 'admin' | 'user';
    }
  }
}

const ProfilePage = async () => {
  try {
    // التحقق من المصادقة
    const { userId } = auth();
    const user = await currentUser();

    // إعادة التوجيه إذا لم يكن مسجلاً دخولًا
    if (!userId || !user) {
      const redirectUrl = encodeURIComponent('/profile');
      redirect(`/sign-in?redirect_url=${redirectUrl}`);
    }

    // التحقق من الصلاحيات مع القيمة الافتراضية
    const fullUserData = await clerkClient.users.getUser(userId);
    const role = fullUserData.publicMetadata.role as 'admin' | 'user' || 'user';

    if (role !== 'admin') {
      redirect('/unauthorized?code=403&from=profile');
    }

    // جلب البيانات المتوازي مع معالجة الأخطاء
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

    // معالجة نتائج البيانات
    const handleDataResult = <T,>(result: PromiseSettledResult<T>, errorMsg: string): T => {
      if (result.status === 'rejected') {
        console.error(errorMsg, result.reason);
        throw new Error(errorMsg);
      }
      return result.value;
    };

    const jobs = handleDataResult(jobsData, 'Failed to load jobs');
    const profile = handleDataResult(profileData, 'Profile load failed');

    // التحقق من اكتمال الملف الشخصي
    if (!profile) {
      redirect('/complete-profile?source=profile');
    }

    // معالجة الوظائف المتقدم لها
    const formattedJobs: AppliedJobsColumns[] = profile.appliedJobs
      .filter(appliedJob => jobs.some(job => job.id === appliedJob.jobId))
      .map(appliedJob => {
        const job = jobs.find(j => j.id === appliedJob.jobId)!;
        return {
          id: job.id,
          title: job.title,
          company: job.company?.name || "Unspecified Company",
          category: job.category?.name || "General",
          appliedAt: appliedJob.appliedAt
            ? format(new Date(appliedJob.appliedAt), "MMM do, yyyy")
            : "Not Available"
        };
      });

    // معالجة الشركات المتابعة
    const followedCompanies = handleDataResult(followedCompaniesData, 'Failed to load followed companies');

    return (
      <ErrorBoundary>
        <div className="flex flex-col p-4 md:p-8 items-center justify-center">
          <Box className="w-full max-w-6xl">
            <CustomBreadCrumb breadCrumbPage="My Profile" />
          </Box>

          {/* قسم الملف الشخصي */}
          <Box className="w-full max-w-6xl mt-8 p-6 space-y-8">
            <section className="flex flex-col md:flex-row gap-8 items-start">
              {user?.imageUrl && (
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg">
                  <Image
                    fill
                    className="rounded-full object-cover"
                    alt="Profile Picture"
                    src={user.imageUrl}
                    priority
                    sizes="(max-width: 768px) 100px, 150px"
                    quality={80}
                  />
                </div>
              )}
              
              <div className="flex-1 space-y-6">
                <NameForm initialData={profile} userId={userId} />
                <EmailForm initialData={profile} userId={userId} />
                <ContactForm initialData={profile} userId={userId} />
                <ResumeForm initialData={profile} userId={userId} />
              </div>
            </section>

            {/* قسم الوظائف المتقدم لها */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Applied Jobs
              </h2>
              <DataTable
                columns={columns}
                searchKey="company"
                data={formattedJobs}
                noDataMessage={
                  <div className="p-4 text-center text-muted-foreground">
                    No job applications found
                  </div>
                }
              />
            </section>

            {/* قسم الشركات المتابعة */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Followed Companies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followedCompanies.length === 0 ? (
                  <p className="text-muted-foreground">No followed companies</p>
                ) : (
                  followedCompanies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))
                )}
              </div>
            </section>
          </Box>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('ProfilePage Error:', error);
    const errorId = crypto.randomUUID();
    redirect(`/error?source=profile&errorId=${errorId}`);
  }
};

const CompanyCard = ({ company }: { company: any }) => (
  <Card className="p-4 hover:shadow-lg transition-shadow relative h-full">
    <div className="absolute top-3 right-3">
      <Link href={`/companies/${company.id}`} passHref>
        <Button 
          variant="ghost" 
          size="sm"
          aria-label="View company details"
          className="text-muted-foreground hover:text-primary"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
    </div>
    
    {company.logo && (
      <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
        <Image
          fill
          alt="Company Logo"
          src={company.logo}
          className="object-contain"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={70}
        />
      </div>
    )}
    
    <CardTitle className="text-lg mb-2">
      {company.name || "Unnamed Company"}
    </CardTitle>
    
    {company.description && (
      <CardDescription className="line-clamp-3 text-sm">
        {truncate(company.description, {
          length: 120,
          omission: "...",
        })}
      </CardDescription>
    )}
  </Card>
);

export default ProfilePage;