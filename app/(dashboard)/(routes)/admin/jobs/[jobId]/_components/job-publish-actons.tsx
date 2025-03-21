// JobPublishAction.tsx
"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({ disabled, jobId, isPublished }: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = isPublished ? `/api/jobs/${jobId}/unpublish` : `/api/jobs/${jobId}/publish`;
      await axios.patch(url);
      toast.success(`Job ${isPublished ? "Unpublished" : "Published"}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job Deleted");
      router.refresh();
      router.push("/admin/jobs");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
     <Button variant="outline" onClick={onClick} disabled={disabled || isLoading} size="sm">
  {isPublished ? "Unpublish" : "Publish"}
</Button>

      <Button variant="destructive" size="icon" disabled={isLoading} onClick={onDelete}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};