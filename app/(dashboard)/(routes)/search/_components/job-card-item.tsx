"use client";
import { Company, Job } from "@prisma/client";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookOpenCheck,
  BriefcaseIcon,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { useState } from "react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

// Experience mapping for display values
const EXPERIENCE_MAP: { [key: string]: string } = {
  "0": "Fresher",
  "2": "0-2 Years Experience",
  "3": "2-4 Years Experience",
  "5": "5+ Years Experience",
};

const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  // State for bookmark loading status
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  
  // Check if job is saved by current user
  const isSavedByUser = userId && job.savedUsers?.includes(userId);
  
  // Router for page refresh after actions
  const router = useRouter();

  // Type assertion for job with company relation
  const typeJob = job as Job & {
    company: Company | null;
  };
  const company = typeJob.company;

  // Handle job save/unsave functionality
  const handleSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      const endpoint = isSavedByUser 
        ? `/api/jobs/${job.id}/removeJobFromCollections`
        : `/api/jobs/${job.id}/saveJobToCollections`;

      await axios.patch(endpoint);
      toast.success(isSavedByUser ? "Job removed" : "Job saved");
      router.refresh();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Error:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Get display label for experience value
  const getExperienceLabel = (value: string) => {
    return EXPERIENCE_MAP[value] || "Not specified";
  };

  return (
    <motion.div layout className="h-full">
      <Card className="h-full flex flex-col justify-between">
        {/* Main Card Content */}
        <div className="p-4 space-y-4">
          {/* Date and Save Button Section */}
          <Box className="justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveJob}
              disabled={isBookmarkLoading}
              aria-label={isSavedByUser ? "Remove from saved" : "Save job"}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSavedByUser ? (
                <BookOpenCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </Box>

          {/* Company Information Section */}
          <Box className="gap-4 items-start">
            {/* Company Logo */}
            <div className="relative w-12 h-12 min-w-[3rem] rounded-md overflow-hidden border">
              {company?.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50px, 75px"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {company?.name?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Job Title and Company Name */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              {company && (
                <Link
                  href={`/companies/${company.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {company.name}
                </Link>
              )}
            </div>
          </Box>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Shift Timing */}
            {job.shiftTiming && (
              <div className="flex items-center gap-1">
                <BriefcaseIcon className="w-4 h-4 flex-shrink-0" />
                <span>{formattedString(job.shiftTiming)}</span>
              </div>
            )}

            {/* Work Mode */}
            {job.workMode && (
              <div className="flex items-center gap-1">
                <Layers className="w-4 h-4 flex-shrink-0" />
                <span>{formattedString(job.workMode)}</span>
              </div>
            )}

            {/* Hourly Rate */}
            {job.hourlyRate && (
              <div className="flex items-center gap-1">
                <Currency className="w-4 h-4 flex-shrink-0" />
                <span>{formattedString(job.hourlyRate)} $/hr</span>
              </div>
            )}

            {/* Experience Requirement */}
            {job.yearsOfExperience && (
              <div className="flex items-center gap-1">
                <Network className="w-4 h-4 flex-shrink-0" />
                <span>{getExperienceLabel(job.yearsOfExperience)}</span>
              </div>
            )}
          </div>

          {/* Job Description */}
          {job.short_description && (
            <CardDescription className="line-clamp-3">
              {job.short_description}
            </CardDescription>
          )}

          {/* Job Tags */}
          {job.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 6).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-accent rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="p-4 border-t flex gap-2">
          {/* Details Button */}
          <Button
            asChild
            variant="outline"
            className="flex-1 hover:bg-primary/10"
          >
            <Link href={`/jobs/${job.id}`} className="text-primary">
              View Details
            </Link>
          </Button>
          
          {/* Save Button */}
          <Button
            onClick={handleSaveJob}
            variant={isSavedByUser ? "secondary" : "default"}
            className="flex-1 gap-2"
            disabled={isBookmarkLoading}
          >
            {isBookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSavedByUser ? (
              "Saved"
            ) : (
              "Save Job"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;