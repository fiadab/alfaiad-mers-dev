import { compileSendSelectedEmailTemplate,  sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const {email, fullName} = await req.json();

    const response = await sendMail({
        to: email,
        name: fullName,
        subject: "Congratulations You have Been Selected",
        body: compileSendSelectedEmailTemplate(fullName),
    });

    if(response?.messageId){
        return NextResponse.json("Mail Delivered", {status: 200});
    }else{
        return new NextResponse("Mail Not Send", {status: 401});
    }
};