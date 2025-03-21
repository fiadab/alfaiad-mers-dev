import { compileThankyouEmailTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const {email, fullName} = await req.json();

    const response = await sendMail({
        to: email,
        name: fullName,
        subject: "Thank you for applying",
        body: compileThankyouEmailTemplate(fullName),
    });

    if(response?.messageId){
        return NextResponse.json("Mail Delivered", {status: 200});
    }else{
        return new NextResponse("Mail Not Send", {status: 401});
    }
};