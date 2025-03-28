import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    // التحقق من صلاحية المستخدم
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // استخراج البيانات من الطلب
    const values = await req.json();

    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("Bad Request: No data provided", { status: 400 });
    }

    // البحث عن ملف تعريف المستخدم
    let userProfile = await db.userProfile.findUnique({
      where: { userId },
    });

    if (userProfile) {
      // تحديث ملف تعريف المستخدم إذا كان موجودًا
      userProfile = await db.userProfile.update({
        where: { userId },
        data: values,
      });
    } else {
      // إنشاء ملف تعريف جديد إذا لم يكن موجودًا
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error(`[USER_PROFILE_PATCH_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};