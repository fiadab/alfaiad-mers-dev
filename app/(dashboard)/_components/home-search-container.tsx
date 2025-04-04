"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const HomeSearchContainer = () => {
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleClick = () => {
        const href = qs.stringifyUrl({
            url: "/search",
            query: {
                title: title.trim() || undefined, // إزالة المسافات الفارغة
            },
        });
        router.push(href);
    };

    return (
        <div className="w-full items-center justify-center hidden md:flex mt-8 px-4">
            <Box className="w-3/4 p-4 rounded-full h-16 shadow-lg px-12 text-muted-foreground gap-3 bg-neutral-50 flex items-center">
                <Input
                    placeholder="Search By Job Name..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 text-lg font-sans bg-transparent outline-none border-none min-w-72"
                />
                <Button
                    onClick={handleClick}
                    disabled={!title.trim()} // يعطل الزر إذا لم يكن هناك إدخال
                    className="bg-purple-700 hover:bg-purple-800 transition"
                    size="icon"
                >
                    <Search className="w-5 h-5 min-w-5" />
                </Button>
            </Box>
        </div>
    );
};
