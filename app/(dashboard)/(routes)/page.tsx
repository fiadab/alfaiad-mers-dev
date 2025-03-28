// app/dashboard/page.tsx
import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { HomeSearchContainer } from "../_components/home-search-container";
import Image from "next/image";
import HomescreenCategoriesContainer from "../_components/home-screen-categories-container";
import { HomeCompaniesList } from "../_components/home-companies-list";
import { RecommendedJobslist } from "../_components/recommended-jobs";
import Footer from "@/components/footer";
import { redirect } from "next/navigation";
import HomePageCarousel from "../_components/home-page-carousel";
const DashboardHomePage = async () => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) redirect('/sign-in');
    if (user.publicMetadata.role !== 'admin') redirect('/unauthorized');

    const [{ jobs }, categories, companies] = await Promise.all([
      getJobs({}),
      db.category.findMany({ orderBy: { name: "asc" } }),
      db.company.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return (
    <div className="flex-col p-4 space-y-12">
        <Box className="flex-col justify-center w-full scroll-py-4 mt-12">
            <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wider text-neutral-600">
                Find Your Dream Job
            </h2>
            <p className="text-2xl text-muted-foreground">
                {jobs.length} + jobs for you to explore{" "}
            </p>
        </Box>

        <HomeSearchContainer />

        {/* استبدل هذا المكون بالمكون الجديد للكاروسيل */}
        <div className="relative w-full mx-auto max-w-7xl">
    <HomePageCarousel />
  </div>

        <HomescreenCategoriesContainer categories={categories} />
        <HomeCompaniesList companies={companies} />
        <RecommendedJobslist jobs={jobs.slice(0, 6)} userId={userId} />

        <Footer />
    </div>
    );
};

export default DashboardHomePage;
