"use client";
import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Model } from "./modal";
import { Box } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

interface ApplyModelProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

export const ApplyModel = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    userProfile,
}: ApplyModelProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Model
            title="Are You Sure?"
            description="This Action Cannot Be Undone"
            isOpen={isOpen}
            onClose={onClose}
        >
            <Box>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <label className="p-3 border rounded-md">
                        {userProfile?.fullName}
                    </label>
                    <label className="p-3 border rounded-md">
                        {userProfile?.contact}
                    </label>
                    <label className="p-3 border rounded-md col-span-2">
                        {userProfile?.email}
                    </label>
                    <label className="p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap">
                        Your Action Resume :{" "}
                        <span className="text-purple-700 w-full truncate">
                            {
                                userProfile?.resumes.find(
                                    (resume) => resume.id === userProfile?.activeResumeId
                                )?.name
                            }
                        </span>
                    </label>
                    <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
                        Change Your Details <Link href={"/user"} className="text-purple-700 ml-2">Over here</Link>
                    </div>
                </div>
            </Box>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant={"outline"} onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} className="bg-purple-700 hover:bg-purple-800" onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Model>
    );
};
