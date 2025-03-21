import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Attachment } from "@prisma/client";

export const DELETE = async (req: Request, { params }: { params: { jobId: string } }) => {
    try {
        const { userId } = await auth();
        const { jobId } = params;

        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 401 });
        }

        if (!jobId) {
            return new NextResponse("Id Is Missing", { status: 401 });
        }

        const job = await db.job.findUnique({
            where: {
                id: jobId,
                userId,
            },
            include: {
                attachments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!job) {
            return new NextResponse("Job Not Found", { status: 404 });
        }

        // حذف الصورة من Edge Store إذا كانت موجودة
        if (job?.imageUrl) {
            try {
                const filePath = job.imageUrl.replace(/^public\//, "");
                const { error: storageError } = await fetch("https://dashboard.edgestore.dev/projects/kuqxpiqhkvv850s0/buckets/kl2uw7bp56ywfs84", { // استبدال URL بـ Edge Store API
                    method: "POST",
                    body: JSON.stringify({ filePath }),
                }).then((res) => res.json());

                if (storageError) {
                    throw new Error(storageError);
                }
            } catch (error) {
                console.error(`[DELETE_IMAGE]: ${error}`);
                throw new Error("Failed to delete image from Edge Store");
            }
        }

        if (Array.isArray(job?.attachments) && job.attachments.length > 0) {
            await Promise.all(
                job.attachments.map(async (attachment: Attachment) => {
                    try {
                        const filePath = attachment.url.replace(/^public\//, "");
                        const { error: storageError } = await fetch("https://files.edgestore.dev/myProtectedFiles/", {
                            method: "POST",
                            body: JSON.stringify({ filePath }),
                        }).then((res) => res.json());

                        if (storageError) {
                            throw new Error(storageError);
                        }
                    } catch (error) {
                        console.error(`[DELETE_ATTACHMENT]: ${error}`);
                        throw new Error("Failed to delete attachment from Edge Store");
                    }
                })
            );
        }

        await db.attachment.deleteMany({
            where: {
                jobId,
            },
        });

        const deleteJob = await db.job.delete({
            where: {
                id: jobId,
                userId,
            },
        });

        return NextResponse.json(deleteJob);
    } catch (error) {
        console.error(`[JOB_DELETE]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
