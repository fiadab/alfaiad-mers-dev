import { Job, Attachment, AppliedJob } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startOfToday, subDays, startOfWeek, subWeeks, startOfMonth } from "date-fns";

type GetJobsOptions = {
  userId?: string;
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
  appliedJobs: AppliedJob[];
};

const getStartDate = (filter?: string): Date => {
  const today = startOfToday();
  switch (filter) {
    case "today": return subDays(today, 1);
    case "yesterday": return subDays(today, 2);
    case "thisWeek": return startOfWeek(today);
    case "lastWeek": return startOfWeek(subWeeks(today, 1));
    case "thisMonth": return startOfMonth(today);
    default: return new Date(0);
  }
};

export const getJobs = async (
  options: GetJobsOptions
): Promise<{ jobs: JobWithRelations[]; total: number }> => {
  try {
    const { userId } = await auth();
    const { page = 1, perPage = 10 } = options;

    const where: Record<string, any> = { isPublished: true };
    const andConditions = [];

    if (options.title) {
      andConditions.push({
        title: { contains: options.title, mode: 'insensitive' }
      });
    }

    if (options.categoryId) {
      andConditions.push({ categoryId: options.categoryId });
    }

    if (options.createdAtFilter) {
      where.createdAt = { gte: getStartDate(options.createdAtFilter) };
    }

    const processMultiValues = (value?: string) => 
      value?.split(',').map(v => v.trim()) || undefined;

    if (options.shiftTiming) {
      where.shiftTiming = { in: processMultiValues(options.shiftTiming) };
    }

    if (options.workMode) {
      where.workMode = { in: processMultiValues(options.workMode) };
    }

    if (options.yearsOfExperience) {
      where.yearsOfExperience = { in: processMultiValues(options.yearsOfExperience) };
    }

    if (options.savedJobs) {
      if (!userId) throw new Error('User ID required for saved jobs filter');
      where.savedUsers = { has: userId };
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: {
          company: { select: { name: true } },
          category: { select: { name: true } },
          attachments: true,
          appliedJobs: true
        },
        orderBy: { createdAt: "desc" },
        take: perPage,
        skip: (page - 1) * perPage
      }),
      db.job.count({ where })
    ]);

    return {
      jobs: jobs as JobWithRelations[],
      total
    };

  } catch (error) {
    console.error("[GET_JOBS_ERROR]:", error);
    throw new Error(`Failed to retrieve jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};