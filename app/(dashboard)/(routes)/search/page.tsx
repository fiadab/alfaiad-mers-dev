import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import PageContent from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

interface SearchProps{
    searchParams:{
        title: string;
        categoryId: string;
        createdAtFilter: string;
        shiftTiming: string;
        workMode: string;
        yearsOfExperience: string;
    };
}

const SearchPage = async ({searchParams} : SearchProps) => {
    // جلب الفئات
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    // جلب المستخدم
    const { userId } = await auth();

    // جلب الوظائف
    const { jobs, total } = await getJobs({ ...searchParams });
    console.log(`Jobs count : ${jobs.length}`);

    return (
        <>
            <div className="px-6 pt-6 block md:hidden md:mb-0">
                <SearchContainer/>
            </div>

            <div className="p-6">
                {/* الفئات */}
                <CategoriesList categories={categories} />
                
                {/* الفلاتر المطبقة */}
                <AppliedFilters categories={categories} />

                {/* محتوى الصفحة */}
                <PageContent jobs={jobs} userId={userId} />
            </div>
        </>
    );
};

export default SearchPage;
