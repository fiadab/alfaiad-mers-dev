import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanySocialContactsForm } from "./social-contact-form";
import { CompanyCoverImageForm } from "./cover-image-form";
import { CompanyOverviewForm } from "./company-overview";
import { WhyJoinUsForm } from "./why-join-us-form";
import { auth } from "@clerk/nextjs/server";;

const CompanyEditPage = async ({ params }: { params: { companyId: string } }) => {
  // verify the MongoDB Id
  const validObjectIdReqex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdReqex.test(params.companyId)) {
    return redirect("/admin/companies");
  }
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All fields {completionText}
          </span>
        </div>
      </div>


      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize Your Company </h2>
          </div>
          {/* Name Form */}
          <CompanyName initialData={company} companyId={company.id} />
          {/* Description Form */}
          <CompanyDescriptionForm initialData={company} companyId={company.id} />
          {/* Company Logo Form */}
          <CompanyLogoForm initialData={company} companyId={company.id} />
        </div>





        {/* Right Container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <IconBadge icon={Network} />
              <h2 className="text-xl">Company Social Contacts</h2>
            </div>
            {/* Social Form */}
            <CompanySocialContactsForm initialData={company} companyId={company.id} />

            {/* Company Cover Image Form */}
            <CompanyCoverImageForm initialData={company} companyId={company.id} />
          </div>
        </div>

        <div className="col-span-2">
          <CompanyOverviewForm initialData={company} companyId={company.id} />
        </div>

        <div className="col-span-2">
          <WhyJoinUsForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
