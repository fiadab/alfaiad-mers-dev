// Core job interface
export interface Job {
  id: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  imageUrl?: string | null;
  company?: Company; // Company relation
}

// Company details
export interface Company {
  id: string;
  name: string;
}

// Applied job relationship
export interface AppliedJob {
  id: string;
  jobId: string;
  job: Job; // Full job relationship
  appliedAt: Date;
}

// Complete user profile type
export interface UserProfile {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  contact: string | null;
  activeResumeId: string | null;
  resumes: Resumes[];
  appliedJobs: AppliedJob[]; // Array of applied jobs
}

// Resume/CV attachment type
export interface Resumes {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
}