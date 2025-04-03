// src/lib/validators/jobs.ts
import { z } from "zod";

export const jobsFilterSchema = z.object({
  title: z.string().optional(),
  categoryId: z.string().optional(),
  createdAtFilter: z.enum([
    "today", 
    "yesterday", 
    "thisWeek", 
    "lastWeek", 
    "thisMonth",
    ""
  ]).optional(),
  shiftTiming: z.string().optional(),
  workMode: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  savedJobs: z.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).default(10),
}).strict();