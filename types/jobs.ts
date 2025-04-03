// types/jobs.ts
import { Job, Attachment, AppliedJob } from "@prisma/client";

export type GetJobsOptions = {
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

export type JobWithRelations = Job & {
  company: { name: string };
  category: { name: string };
  attachments: Attachment[];
  appliedJobs: AppliedJob[];
};

export type JobsFilterSchema = {
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