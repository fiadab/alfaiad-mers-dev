export interface AppliedJob {
    id: string;
    jobId: string;
    userProfileId: string;
    appliedAt: Date;
    job: Job;
  }
  
  export interface Job {
    id: string;
    title: string;
    description?: string | null;
    short_description?: string | null;
    imageUrl?: string | null;
  }
  
  export interface UserProfile {
    id: string;
    userId: string;
    fullName?: string | null;
    email?: string | null;
    contact?: string | null;
    activeResumeId?: string | null;
    resumes: Resumes[];
  }
  
  export interface UserProfileWithAppliedJobs extends UserProfile {
    appliedJobs: AppliedJob[];
  }
  
  export interface Resumes {
    id: string;
    name: string;
    url: string;
    userProfileId: string;
    createdAt: Date;
    updatedAt: Date;
  }