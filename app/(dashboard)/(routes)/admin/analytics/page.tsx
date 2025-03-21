import { getPieGraphCompanyCreatedByUser, getPieGraphJobCreatedByUser, getTotalCompaniesOnPortal, getTotalCompaniesOnPortalByUserId, getTotalJobOnPortal, getTotalJobOnPortalByUserId } from "@/actions/get-overview-analytics";
import Box from "@/components/box";
import { OverviewPieChart } from "@/components/overview-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { Briefcase } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardAnalyticsPage = async () => {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const [
        totalJobsOnPortal,
        totalJobsOnPortalByUser,
        totalCompaniesOnPortal,
        totalCompaniesOnPortalByUser,
        graphJobTotal,
        graphCompanyTotal
    ] = await Promise.all([
        getTotalJobOnPortal(),
        getTotalJobOnPortalByUserId(userId),
        getTotalCompaniesOnPortal(), // تمت إزالة المعلمة userId
        getTotalCompaniesOnPortalByUserId(userId),
        getPieGraphJobCreatedByUser(userId),
        getPieGraphCompanyCreatedByUser(userId)
    ]);

    return (
        <Box className="flex-col items-start p-4">
            <div className="flex flex-col items-start">
                <h2 className="font-sans tracking-wider font-bold text-2xl">
                    Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                    Overview Of Your Account
                </p>
            </div>
            <Separator className="my-4" />

            <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-4">
                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {totalJobsOnPortal}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Total Jobs By User</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {totalJobsOnPortalByUser}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {totalCompaniesOnPortal}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Total Companies By User</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {totalCompaniesOnPortalByUser}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2 mt-4">
                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Month Wise Jobs Count</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="h-80">
                        <OverviewPieChart data={graphJobTotal} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="items-center justify-between flex-row">
                        <CardTitle className="text-sm font-medium">Month Wise Companies Count</CardTitle>
                        <Briefcase className="w-4 h-4" />
                    </CardHeader>
                    <CardContent className="h-80">
                        <OverviewPieChart data={graphCompanyTotal} />
                    </CardContent>
                </Card>
            </div>
        </Box>
    );
};

export default DashboardAnalyticsPage;
