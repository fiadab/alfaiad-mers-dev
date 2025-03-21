"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Ban, Loader, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface CellActionsProps {
    id: string;
    fullName: string;
    email: string;
}

export const CellActions = ({ id, fullName, email }: CellActionsProps) => {
    const [loadingState, setLoadingState] = useState<"none" | "selected" | "rejected">("none");

    const sendAction = async (type: "selected" | "rejected") => {
        setLoadingState(type);
        try {
            const endpoint = type === "selected" ? "/api/sendSelected" : "/api/sendRejection";
            await axios.post(endpoint, { email, fullName });
            toast.success("Mail Sent");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoadingState("none");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {loadingState === "selected" ? (
                    <DropdownMenuItem className="flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin" />
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => sendAction("selected")} className="flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        Selected
                    </DropdownMenuItem>
                )}
                {loadingState === "rejected" ? (
                    <DropdownMenuItem className="flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin" />
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => sendAction("rejected")} className="flex items-center justify-center">
                        <Ban className="w-4 h-4 mr-2" />
                        Rejected
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
