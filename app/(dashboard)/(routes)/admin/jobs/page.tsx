'use client';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./_components/columns";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const JobPageOverview = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

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
          company: job.company?.name || "No Company",
          category: job.category?.name || "Uncategorized",
          isPublished: job.isPublished,
          createdAt: format(new Date(job.createdAt), "MMM d, yyyy"),
        }));
        setJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [userId, router]);

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