// app/(admin)/admin/jobs/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobColumns } from "./_components/columns";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const JobPageOverview = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobColumns[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        
        const data = await response.json();
        
        // Transform data for table
        const formattedJobs = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || null,
          category: job.category?.name || null,
          isPublished: job.isPublished,
          createdAt: job.createdAt,
          applications: job.appliedJobs?.length || 0
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
      <div className="flex items-end justify-end">
        <Link href="/admin/create">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={jobs}
          searchKey="title"
        />
      </div>
    </div>
  );
};

export default JobPageOverview;