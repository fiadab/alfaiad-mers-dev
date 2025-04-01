// types/userProfile.ts

// واجهة الوظيفة الأساسية
export interface Job {
  id: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  imageUrl?: string | null;
  company?: Company;
}

// تفاصيل الشركة
export interface Company {
  id: string;
  name: string;
}

// علاقة الوظائف المتقدم لها
export interface AppliedJob {
  id: string;
  jobId: string;
  job: Job;
  appliedAt: Date;
}

// نوع الملف الشخصي الكامل للمستخدم
export interface UserProfile {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  contact: string | null;
  activeResumeId: string | null;
  resumes: Resumes[];
  appliedJobs: AppliedJob[];
}

// نوع المرفقات (السير الذاتية)
export interface Resumes {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
}