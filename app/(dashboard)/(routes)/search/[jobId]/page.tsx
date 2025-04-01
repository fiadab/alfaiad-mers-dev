// app/(dashboard)/(routes)/search/[jobId]/page.tsx

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "@/types/userProfile";
import { redirect } from "next/navigation";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  // جلب بيانات الوظيفة مع معلومات الشركة
  const job = await db.job.findUnique({
    where: { id: params.jobId },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) redirect("/search");

  // جلب بيانات الملف الشخصي للمستخدم مع العلاقات
  const profile = await db.userProfile.findUnique({
    where: { userId: userId as string },
    include: {
      resumes: { orderBy: { createdAt: "desc" } },
      appliedJobs: {
        include: {
          job: {
            include: {
              company: true
            }
          }
        }
      },
    },
  }) as UserProfile | null;

  if (!profile) redirect("/login");

  // بيانات الملف الشخصي مع قيم افتراضية
  const safeProfile = {
    ...profile,
    fullName: profile.fullName || "",
    email: profile.email || "",
    contact: profile.contact || "",
    appliedJobs: profile.appliedJobs || [],
  };

  // التحقق من التقدم للوظيفة
  const hasApplied = safeProfile.appliedJobs.some(
    (appliedJob) => appliedJob.job.id === job.id
  );

  return (
    <div className="flex-col p-4 md:p-8">
      {/* مؤشر حالة التقدم */}
      {hasApplied && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700">✓ لقد تقدمت لهذه الوظيفة</p>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;