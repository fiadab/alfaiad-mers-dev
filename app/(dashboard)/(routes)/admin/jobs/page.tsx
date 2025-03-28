"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./_components/columns";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const JobPageOverview = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        const formattedJobs = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || "No Company", // ✅ اسم الشركة
          category: job.category?.name || "Uncategorized", // ✅ التصنيف
          isPublished: job.isPublished,
          createdAt: format(new Date(job.createdAt), "MMM d, yyyy"), // ✅ تنسيق التاريخ
        }));

        setJobs(formattedJobs);
      } catch (error) {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-gray-500">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* زر إضافة وظيفة جديدة */}
      <div className="flex items-end justify-end">
        <Link href="/admin/create">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </Link>
      </div>

      {/* جدول عرض الوظائف */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={jobs}
          searchKey="title" // ✅ البحث حسب العنوان
        />
      </div>
    </div>
  );
};

export default JobPageOverview;