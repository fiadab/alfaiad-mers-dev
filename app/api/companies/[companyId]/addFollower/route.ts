import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// اجعل المسار ديناميكيًا لمنع محاولة تجميع بيانات الصفحة أثناء البناء
export const dynamic = "force-dynamic";

export const PATCH = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params;

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Id Is Missing", { status: 401 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return new NextResponse("Company Not Found", { status: 401 });
    }

    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: { push: userId },
      },
    });
    
    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
