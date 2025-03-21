import { db } from "@/lib/db";

interface PieChartMonthlyCount {
    name: string;
    value: number;
}

export const getTotalJobOnPortal = async () => {
    const jobs = await db.job.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return jobs.length;
};

export const getTotalJobOnPortalByUserId = async (userId: string | null) => {
    if (!userId) return 0;

    const jobs = await db.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return jobs.length;
};

export const getTotalCompaniesOnPortal = async () => { // تم إزالة المعلمة userId
    const companies = await db.company.findMany({
        orderBy: { createdAt: "desc" },
    });
    return companies.length;
};

export const getTotalCompaniesOnPortalByUserId = async (userId: string | null) => {
    if (!userId) return 0;

    const companies = await db.company.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return companies.length;
};

export const getPieGraphJobCreatedByUser = async (userId: string | null): Promise<PieChartMonthlyCount[]> => {
    if (!userId) return [];

    const jobs = await db.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyCount: PieChartMonthlyCount[] = months.map(month => ({
        name: month,
        value: 0,
    }));

    const monthlyCountLookup = monthlyCount.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {} as Record<string, PieChartMonthlyCount>);

    jobs.forEach(job => {
        const createdAt = new Date(job.createdAt);
        if (createdAt.getFullYear() === currentYear) {
            const monthName = createdAt.toLocaleString("en-US", { month: "short" });
            if (monthlyCountLookup[monthName]) {
                monthlyCountLookup[monthName].value++;
            }
        }
    });

    return monthlyCount;
};

export const getPieGraphCompanyCreatedByUser = async (userId: string | null): Promise<PieChartMonthlyCount[]> => {
    if (!userId) return [];

    const companies = await db.company.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyCount: PieChartMonthlyCount[] = months.map(month => ({
        name: month,
        value: 0,
    }));

    const monthlyCountLookup = monthlyCount.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {} as Record<string, PieChartMonthlyCount>);

    companies.forEach(company => {
        const createdAt = new Date(company.createdAt);
        if (createdAt.getFullYear() === currentYear) {
            const monthName = createdAt.toLocaleString("en-US", { month: "short" });
            if (monthlyCountLookup[monthName]) {
                monthlyCountLookup[monthName].value++;
            }
        }
    });

    return monthlyCount;
};
