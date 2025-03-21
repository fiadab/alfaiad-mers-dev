// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { auth } from '@clerk/nextjs/server';
// import { initEdgeStoreClient } from '@edgestore/server/core';
// import { edgeStoreRouter } from '@/app/api/edgestore/[...edgestore]/route';

// // ✅ Ensure `EDGE_STORE_ACCESS_KEY` is set in environment variables
// if (!process.env.EDGE_STORE_ACCESS_KEY) {
//   console.warn('⚠️ EDGE_STORE_ACCESS_KEY is not defined in environment variables.');
// }

// // ✅ Proper EdgeStore initialization
// const edgestore = initEdgeStoreClient({
//   router: edgeStoreRouter,
//   accessKey: process.env.EDGE_STORE_ACCESS_KEY,
// });

// export async function DELETE(req: Request) {
//   try {
//     // ✅ Authenticate the user
//     const { userId } = await auth();
//     if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     // ✅ Extract `jobId` and `attachmentId` from the request
//     const { searchParams } = new URL(req.url);
//     const jobId = searchParams.get('jobId');
//     const { attachmentId } = await req.json();

//     if (!attachmentId || !jobId) {
//       return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
//     }

//     // ✅ Check if the attachment exists in the database
//     const attachment = await db.attachment.findUnique({ where: { id: attachmentId, jobId } });
//     if (!attachment) return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });

//     // ✅ Delete the file from EdgeStore
//     await edgestore.myProtectedFiles.deleteFile({ url: attachment.url });

//     // ✅ Remove the record from the database
//     await db.attachment.delete({ where: { id: attachmentId } });

//     return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Delete Error:", error);

//     // Ensure error is an instance of Error before accessing `.message`
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { jobId, url } = await req.json();

    if (!jobId || !url) {
      return new Response(
        JSON.stringify({ error: "Job ID and URL are required." }),
        { status: 400 }
      );
    }

    await db.attachment.deleteMany({
      where: { jobId, url },
    });

    return new Response(
      JSON.stringify({ message: "Attachment deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete attachment." }),
      { status: 500 }
    );
  }
};
