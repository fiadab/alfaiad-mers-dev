import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import CompanyDetailContentPage from "./_components/company-detail-content";
 
const CompanyDetailsPage = async ({
    params,
}: {
  params: { companyId: string };
}) => {
  const { userId } = await auth();
  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
  });
  if (!company || !userId) {
    redirect("/");
  }
  const jobs = await db.job.findMany({
    where: {
      companyId: params.companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company?.name !== undefined ? company?.name : ""}
        />
      </Box>
      {/* Company Image */}
      {company?.coverImage && (
        <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
          <Image
            alt={company?.name}
             src={company.coverImage.startsWith('/') || company.coverImage.startsWith('http') ? company.coverImage : `/${company.coverImage}`}
            fill
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Company Details */}
      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId} />
    </div>
  );
};

export default CompanyDetailsPage;

