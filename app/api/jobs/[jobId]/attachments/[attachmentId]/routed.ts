// app/api/jobs/[jobId]/attachments/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { useEdgeStore } from "@/lib/edgestore";
import { z } from "zod";

// ✅ Define attachment type
interface AttachmentData {
  url: string;
  name: string;
}

export async function PATCH(req: Request) {
  const { edgestore } = useEdgeStore(); // ✅ Initialize EdgeStore

  try {
    // ✅ Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse the request body
    const { jobId, attachments } = await req.json() as {
      jobId: string;
      attachments: AttachmentData[];
    };

    // ✅ Validate if the job exists and belongs to the user
    const job = await db.job.findUnique({
      where: { id: jobId, userId }
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // ✅ Retrieve existing attachments
    const existingAttachments = await db.attachment.findMany({
      where: { jobId }
    });

    // ✅ Determine files to be deleted
    const toDelete = existingAttachments.filter(
      ea => !attachments.some(a => a.url === ea.url)
    );

    // ✅ Delete files from EdgeStore
    await Promise.all(
      toDelete.map(async (attachment) => {
        await edgestore.myProtectedFiles.delete({
          url: attachment.url
        });
      })
    );

    // ✅ Perform database transaction:
    // 1. Remove deleted attachments from the database
    // 2. Add new attachments that do not already exist
    await db.$transaction([
      db.attachment.deleteMany({
        where: { id: { in: toDelete.map(d => d.id) } }
      }),
      db.attachment.createMany({
        data: attachments
          .filter(a => !existingAttachments.some(ea => ea.url === a.url))
          .map(a => ({
            jobId,
            url: a.url,
            name: a.name
          }))
      })
    ]);

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update Error:", error);
    
    // ✅ Handle unknown error types safely
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


// // PATCH Handler (api/jobs/[jobId]/attachments/route.ts)
// import { db } from "@/lib/db";
// export async function PATCH(req: Request) {
//   try {
//     const { jobId, attachments } = await req.json();

//     if (!jobId || !attachments) {
//       return new Response(
//         JSON.stringify({ error: "Job ID and attachments are required." }),
//         { status: 400 }
//       );
//     }

//     // Iterate over the attachments and update them individually
//     for (const attachment of attachments) {
//       const { id, url, name } = attachment;

//       // Ensure each attachment has an ID to update
//       if (!id) {
//         return new Response(
//           JSON.stringify({ error: "Each attachment must have an ID to update." }),
//           { status: 400 }
//         );
//       }

//       await db.attachment.update({
//         where: { id },
//         data: { url, name },
//       });
//     }

//     return new Response(
//       JSON.stringify({ message: "Attachments updated successfully." }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating attachments:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to update attachments." }),
//       { status: 500 }
//     );
//   }
// };
