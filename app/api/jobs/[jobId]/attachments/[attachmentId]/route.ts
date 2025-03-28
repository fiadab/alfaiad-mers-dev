import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { jobId, url } = await req.json();

    // التحقق من وجود jobId و url
    if (!jobId || !url) {
      return NextResponse.json(
        { error: "Job ID and URL are required." },
        { status: 400 }
      );
    }

    // حذف المرفقات من قاعدة البيانات
    const deletedAttachments = await db.attachment.deleteMany({
      where: { jobId, url },
    });

    // التحقق مما إذا تم حذف أي مرفقات
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