import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEdgeStore } from "@/lib/edgestoreServer"; // Use server-side helper
import { z } from "zod";

// Define the attachment type
interface AttachmentData {
  url: string;
  name: string;
}

// Define validation schema for attachments
const attachmentSchema = z.object({
  url: z.string().url("Invalid URL"),
  name: z.string().min(1, "File name is required"),
});

export async function POST(req: Request) {
  // Initialize EdgeStore using a server-side method instead of a hook
  const edgestore = getEdgeStore();

  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { jobId, attachments } = await req.json() as {
      jobId: string;
      attachments: AttachmentData[];
    };

    // Validate request data
    if (!jobId || !attachments || attachments.length === 0) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Validate each attachment against schema
    const validationErrors = attachments
      .map((attachment) => attachmentSchema.safeParse(attachment))
      .filter((result) => !result.success)
      .map((result) => result.error.format());

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    // Check if the job exists and belongs to the user
    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Create attachments in the database
    const createdAttachments = await db.attachment.createMany({
      data: attachments.map((a) => ({
        jobId,
        url: a.url,
        name: a.name,
      })),
    });

    return NextResponse.json(
      { count: createdAttachments.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Attachment Creation Error:", error);

    // Handle unknown error types safely
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
