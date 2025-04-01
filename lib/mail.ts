import nodemailer from "nodemailer";
import { compile } from "handlebars/runtime"; // التعديل الرئيسي هنا
import { ThankYouTemplate } from "./designs/thank-you";
import { SendSelectedTemplate } from "./designs/send-selected-template";
import { SendRejectionTemplate } from "./designs/send-rejection-template";

type EmailParams = {
  to: string;
  name: string;
  subject: string;
  body: string;
};

type TemplateData = {
  name: string;
};

// دالة مساعدة لتجميع القوالب
const compileTemplate = (template: string, data: TemplateData) => {
  return compile(template)(data);
};

export const sendMail = async ({ to, name, subject, body }: EmailParams) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
  
  // التحقق من وجود متغيرات البيئة
  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error("SMTP configuration missing");
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const sendResult = await transport.sendMail({
      from: `"Your Company Name" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body,
      text: `${subject}\n\nHello ${name},\nPlease enable HTML to view this message.`,
    });
    
    return { success: true, messageId: sendResult.messageId };
  } catch (error) {
    console.error("Mail sending failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// دوال تجميع القوالب
export const compileThankyouEmailTemplate = (name: string) => {
  return compileTemplate(ThankYouTemplate, { name });
};

export const compileSendSelectedEmailTemplate = (name: string) => {
  return compileTemplate(SendSelectedTemplate, { name });
};

export const compileSendRejectionEmailTemplate = (name: string) => {
  return compileTemplate(SendRejectionTemplate, { name });
};