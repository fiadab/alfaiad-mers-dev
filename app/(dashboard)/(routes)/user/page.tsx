// app/(dashboard)/(routes)/user/page.tsx
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
import { format } from "date-fns";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { truncate } from "lodash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AppliedJob } from "@prisma/client";
import { AppliedJobsColumns, columns } from "./_components/column";

const ProfilePage = async () => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    // 1. جلب بيانات الملف الشخصي
    const profile = await db.userProfile.findUnique({
        where: { userId },
        include: {
            resumes: { orderBy: { createdAt: "desc" } },
            appliedJobs: true
        },
    });

    // 2. التحقق من وجود الملف الشخصي
    if (!profile) {
        return (
            <div className="flex-col p-4 md:p-8 items-center justify-center flex">
                <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
                    <h2 className="text-2xl font-semibold text-center">
                        Complete Your Profile Setup
                    </h2>
                    <div className="space-y-4">
                        <NameForm initialData={null} userId={userId} />
                        <EmailForm initialData={null} userId={userId} />
                        <ContactForm initialData={null} userId={userId} />
                        <ResumeForm initialData={null} userId={userId} />
                    </div>
                </Box>
            </div>
        );
    }

    // 3. جلب الوظائف المقدمة
    const jobs = await db.job.findMany({
        where: { userId },
        include: {
            company: true,
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });

    // 4. تصفية الوظائف المتقدم عليها
    const filteredAppliedJobs = profile.appliedJobs
        .map(appliedJob => jobs.find(job => job.id === appliedJob.jobId))
        .filter((job): job is NonNullable<typeof job> => !!job)
        .map(job => ({
            ...job,
            appliedAt: profile.appliedJobs.find(
                appliedJob => appliedJob.jobId === job.id
            )?.appliedAt || new Date()
        }));

    // 5. تنسيق البيانات للجدول
    const formattedJobs: AppliedJobsColumns[] = filteredAppliedJobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || "No company",
        category: job.category?.name || "No category",
        appliedAt: format(job.appliedAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"), // تنسيق ISO
    }));

    // 6. جلب الشركات المتابعة
    const followedCompanies = await db.company.findMany({
        where: { followers: { has: userId } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex-col p-4 md:p-8 items-center justify-center flex">
            <Box>
                <CustomBreadCrumb breadCrumbPage="My Profile"/>
            </Box>

            {/* قسم المعلومات الشخصية */}
            <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
                {user?.hasImage && (
                    <div className="aspect-square w-24 h-24 rounded-full shadow-md relative mx-auto">
                        <Image
                            fill
                            className="w-full h-full object-cover rounded-full"
                            alt="Profile Picture"
                            src={user.imageUrl}
                            priority
                        />
                    </div>
                )}

                <div className="space-y-6">
                    <NameForm initialData={profile} userId={userId} />
                    <EmailForm initialData={profile} userId={userId} />
                    <ContactForm initialData={profile} userId={userId} />
                    <ResumeForm initialData={profile} userId={userId} />
                </div>
            </Box>

            {/* قسم الوظائف المتقدم عليها */}
            <Box className="flex-col items-start justify-start mt-12 w-full">
                <h2 className="text-2xl text-muted-foreground font-semibold mb-6">
                    Applied Jobs History
                </h2>
                <DataTable
                    columns={columns}
                    searchKey="company"
                    data={formattedJobs}
                    placeholder="Search applied jobs..."
                    noDataMessage="No applications found."
                />
            </Box>

            {/* قسم الشركات المتابعة */}
            <Box className="flex-col items-start justify-start mt-12 w-full">
                <h2 className="text-2xl text-muted-foreground font-semibold mb-6">
                    Followed Companies ({followedCompanies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-4 w-full">
                    {followedCompanies.length === 0 ? (
                        <p className="text-muted-foreground">No companies followed yet</p>
                    ) : (
                        followedCompanies.map(company => (
                            <Card key={company.id} className="p-4 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-end">
                                        <Link href={`/companies/${company.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                    {company.logo && (
                                        <div className="relative h-32 w-full mb-4">
                                            <Image
                                                fill
                                                src={company.logo}
                                                alt={`${company.name} logo`}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <CardTitle className="mb-2">{company.name}</CardTitle>
                                    {company.description && (
                                        <CardDescription className="flex-1">
                                            {truncate(company.description, {
                                                length: 100,
                                                omission: "...",
                                            })}
                                        </CardDescription>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Box>
        </div>
    );
};

export default ProfilePage;