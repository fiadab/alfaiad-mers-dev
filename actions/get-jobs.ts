// actions/get-jobs.ts
import { Job, Attachment, AppliedJob } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startOfToday, subDays, startOfWeek, subWeeks, startOfMonth } from "date-fns";

// Enhanced type definitions
type GetJobsOptions = {
  userId?: string; // Added missing property
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
  page?: number;
  perPage?: number;
};

type JobWithRelations = Job & {
  company: { name: string };
  category: { name: string };
  attachments: Attachment[];
  appliedJobs: AppliedJob[]; // Added relation
};

// Helper function for date filtering
const getStartDate = (filter?: string): Date => {
  const today = startOfToday();
  switch (filter) {
    case "today": return subDays(today, 1);
    case "yesterday": return subDays(today, 2);
    case "thisWeek": return startOfWeek(today);
    case "lastWeek": return startOfWeek(subWeeks(today, 1));
    case "thisMonth": return startOfMonth(today);
    default: return new Date(0); // All time
  }
};

// Main job fetching function with improved typing
export const getJobs = async (
  options: GetJobsOptions
): Promise<{ jobs: JobWithRelations[]; total: number }> => {
  try {
    const { userId } = await auth();
    const { page = 1, perPage = 10 } = options;

    // Construct filter conditions
    const where: Record<string, any> = { isPublished: true };
    const andConditions = [];

    // Text search condition
    if (options.title) {
      andConditions.push({
        title: { contains: options.title, mode: 'insensitive' }
      });
    }

    // Category filter
    if (options.categoryId) {
      andConditions.push({ categoryId: options.categoryId });
    }

    // Date filter
    if (options.createdAtFilter) {
      where.createdAt = { gte: getStartDate(options.createdAtFilter) };
    }

    // Array value processor
    const processMultiValues = (value?: string) => 
      value?.split(',').map(v => v.trim()) || undefined;

    // Shift timing filter
    if (options.shiftTiming) {
      where.shiftTiming = { in: processMultiValues(options.shiftTiming) };
    }

    // Work mode filter
    if (options.workMode) {
      where.workMode = { in: processMultiValues(options.workMode) };
    }

    // Experience filter
    if (options.yearsOfExperience) {
      where.yearsOfExperience = { in: processMultiValues(options.yearsOfExperience) };
    }

    // Saved jobs filter
    if (options.savedJobs && userId) {
      where.savedUsers = { has: userId };
    }

    // Combine AND conditions
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Parallel execution of queries
    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: {
          company: { select: { name: true } },
          category: { select: { name: true } },
          attachments: true,
          appliedJobs: true // Include appliedJobs relation
        },
        orderBy: { createdAt: "desc" },
        take: perPage,
        skip: (page - 1) * perPage
      }),
      db.job.count({ where })
    ]);

    // Type-safe return
    return {
      jobs: jobs as JobWithRelations[],
      total
    };

  } catch (error) {
    console.error("[GET_JOBS_ERROR]:", error);
    throw new Error(`Failed to retrieve jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};