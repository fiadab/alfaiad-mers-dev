// actions/get-jobs.ts

// Import necessary types and utilities from Prisma and other libraries
import { Job, Attachment, AppliedJob } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startOfToday, subDays, startOfWeek, subWeeks, startOfMonth } from "date-fns";

// Define the type for job fetching options
type GetJobsOptions = {
  userId?: string; // Optionally filter by user
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

// Define a type that includes job relations
type JobWithRelations = Job & {
  company: { name: string };
  category: { name: string };
  attachments: Attachment[];
  appliedJobs: AppliedJob[]; // Includes the appliedJobs relation
};

// Helper function to calculate the start date based on a filter keyword
const getStartDate = (filter?: string): Date => {
  const today = startOfToday();
  switch (filter) {
    case "today": return subDays(today, 1);
    case "yesterday": return subDays(today, 2);
    case "thisWeek": return startOfWeek(today);
    case "lastWeek": return startOfWeek(subWeeks(today, 1));
    case "thisMonth": return startOfMonth(today);
    default: return new Date(0); // Return all time if no filter is provided
  }
};

// Main function to retrieve jobs based on filtering options
export const getJobs = async (
  options: GetJobsOptions
): Promise<{ jobs: JobWithRelations[]; total: number }> => {
  try {
    // Retrieve the authenticated user id using Clerk
    const { userId } = await auth();
    const { page = 1, perPage = 10 } = options;

    // Build a base filter condition to only show published jobs
    const where: Record<string, any> = { isPublished: true };
    const andConditions = [];

    // Filter by title if provided
    if (options.title) {
      andConditions.push({
        title: { contains: options.title, mode: 'insensitive' }
      });
    }

    // Filter by category if provided
    if (options.categoryId) {
      andConditions.push({ categoryId: options.categoryId });
    }

    // Filter by creation date using the helper function
    if (options.createdAtFilter) {
      where.createdAt = { gte: getStartDate(options.createdAtFilter) };
    }

    // Function to process comma-separated filter values into an array
    const processMultiValues = (value?: string) => 
      value?.split(',').map(v => v.trim()) || undefined;

    // Filter by shift timing if provided
    if (options.shiftTiming) {
      where.shiftTiming = { in: processMultiValues(options.shiftTiming) };
    }

    // Filter by work mode if provided
    if (options.workMode) {
      where.workMode = { in: processMultiValues(options.workMode) };
    }

    // Filter by years of experience if provided
    if (options.yearsOfExperience) {
      where.yearsOfExperience = { in: processMultiValues(options.yearsOfExperience) };
    }

    // If filtering for saved jobs, ensure the user id is present
    if (options.savedJobs && userId) {
      where.savedUsers = { has: userId };
    }

    // Combine any AND conditions collected above into the main filter
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Execute both the findMany and count queries in parallel
    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: {
          company: { select: { name: true } },
          category: { select: { name: true } },
          attachments: true,
          appliedJobs: true // Include appliedJobs relation for each job
        },
        orderBy: { createdAt: "desc" },
        take: perPage,
        skip: (page - 1) * perPage
      }),
      db.job.count({ where })
    ]);

    // Return the results with proper typing
    return {
      jobs: jobs as JobWithRelations[],
      total
    };

  } catch (error) {
    console.error("[GET_JOBS_ERROR]:", error);
    throw new Error(`Failed to retrieve jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
