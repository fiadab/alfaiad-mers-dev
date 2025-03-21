import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
export const PATCH = async (
    reg : Request,
    {params} : {params : {jobId : string}}
) => {
    try {
      const { userId } =  await auth()
      const { jobId } = params

      if(!userId){
        return new NextResponse("Unauthorized", {status: 401});
      }

      if(jobId){
        return new NextResponse("Id Is Missing", {status: 404});
      }

      const job = await db.job.findUnique({
        where:{
            id: jobId,
            userId
        }
      })

      if(!job){
        return new NextResponse("Job Not Found", {status: 404});
      }

       const updatedData = {
        savedUsers: job.savedUsers ? {push: userId} : [userId]
       }
     //Update The Job By Its Saved or not
     const updatedJob = await db.job.update({
        where:{
            id: jobId,
            userId,
        },
        data: updatedData,
     });

      return  NextResponse.json(updatedJob);
    } catch (error) {
        console.log(`[JOP_PUBLISH_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500});
    }
};