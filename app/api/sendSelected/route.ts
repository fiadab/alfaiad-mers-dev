import { compileSendSelectedEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // استخراج البيانات من الطلب
    const { email, fullName } = await req.json();

    // التحقق من صحة البيانات المدخلة
    if (!email || !fullName) {
      return new NextResponse("Bad Request: Missing email or fullName", { status: 400 });
    }

    // إرسال البريد الإلكتروني
    const response = await sendMail({
      to: email,
      name: fullName,
      subject: "Congratulations! You have been selected",
      body: compileSendSelectedEmailTemplate(fullName),
    });

    // التحقق من نجاح الإرسال
    if (response?.messageId) {
      return NextResponse.json("Mail Delivered", { status: 200 });
    } else {
      return new NextResponse("Failed to send mail", { status: 500 });
    }
  } catch (error) {
    console.error(`[SEND_SELECTED_MAIL_ERROR]:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};