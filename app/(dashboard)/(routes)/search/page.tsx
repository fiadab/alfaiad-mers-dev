import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import PageContent from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  };
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch authenticated user
  const { userId } = await auth();

  // Fetch jobs based on search parameters
  const { jobs, total } = await getJobs({ ...searchParams });
  console.log(`Jobs count : ${jobs.length}`);

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        {/* Search bar for mobile view */}
        <SearchContainer />
      </div>

      <div className="p-6">
        {/* Categories list */}
        <CategoriesList categories={categories} />

        {/* Applied filters */}
        <AppliedFilters categories={categories} />

        {/* Page content displaying jobs */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;