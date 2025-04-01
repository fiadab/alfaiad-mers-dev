import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { jobId, url } = await req.json();

    // Validate that jobId and url are provided
    if (!jobId || !url) {
      return NextResponse.json(
        { error: "Job ID and URL are required." },
        { status: 400 }
      );
    }

    // Delete the attachment from the database
    const deletedAttachments = await db.attachment.deleteMany({
      where: { jobId, url },
    });

    // Check if any attachments were deleted
    if (deletedAttachments.count === 0) {
      return NextResponse.json(
        { error: "No attachments found to delete." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Attachment deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      { error: "Failed to delete attachment." },
      { status: 500 }
    );
  }
}
