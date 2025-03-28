"use client";
import Image from "next/image";
import { Job } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import JobCardItem from "./job-card-item";
import { fadeInOut } from "@/animations";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4">
        <div className="relative w-full max-w-[500px] h-[300px]">
          <Image
            src="/img/cv.jpg"
            alt="No jobs illustration"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            quality={80}
          />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            No Opportunities Found
          </h2>
          <p className="text-muted-foreground">
            Start by creating your first job posting
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 md:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
        >
          {jobs.map((job) => (
            <JobCardItem 
              key={job.id}
              job={job}
              userId={userId}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default PageContent;