import nodemailer from "nodemailer";
import handlebars from "handlebars";
import toast from "react-hot-toast";
import { ThankYouTemplate } from "./designs/thank-you";
import { SendSelectedTemplate } from "./designs/send-selected-template";
import { SendRejectionTemplate } from "./designs/send-rejection-template";

export const sendMail = async({
   to,
   name,
   subject,
   body,
}:{
    to: string;
    name: string;
    subject: string;
    body: string;
}) => {
    const {SMTP_PASSWORD, SMTP_EMAIL} = process.env;

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        }
    });

    try {
        const textResult = await transport.verify();
        console.log(textResult);
    } catch (error) {
        console.log(error);
        toast.error((error as Error)?.message);
        return;
    }


    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body,
        });
        return sendResult;
    } catch (error) {
        console.log(error);
        toast.error((error as Error)?.message);
        return;
    }
};

export const compileThankyouEmailTemplate = (name : string) => {
    const template = handlebars.compile(ThankYouTemplate);
    const htmlBody = template({
        name : name,
    });
    return htmlBody;
};

export const compileSendSelectedEmailTemplate = (name : string) => {
    const template = handlebars.compile(SendSelectedTemplate);
    const htmlBody = template({
        name : name,
    });
    return htmlBody;
};

export const compileSendRejectionEmailTemplate = (name : string) => {
    const template = handlebars.compile(SendRejectionTemplate);
    const htmlBody = template({
        name : name,
    });
    return htmlBody;
};