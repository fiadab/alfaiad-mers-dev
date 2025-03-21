// app/(dashboard)/admin/jobs/_components/columns.tsx
"use client";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type JobColumns = {
  id: string;
  title: string;
  company: string | null;
  category: string;
  createdAt: string;
  isPublished: boolean;
  imageUrl?: string | null;
};

export const columns: ColumnDef<JobColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return (
        <div className="h-10 w-10 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Job Image"
              fill
              className="rounded object-cover"
              sizes="50px"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gray-200 rounded" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className={cn(
        "border px-2 py-1 text-xs rounded-md w-24 text-center",
        row.original.isPublished 
          ? "border-emerald-500 bg-emerald-100/80" 
          : "border-red-500 bg-red-100/80"
      )}>
        {row.original.isPublished ? "Published" : "Draft"}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <span>{row.original.company || "No Company"}</span>
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Posted
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/admin/jobs/${row.original.id}`}>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
          <Link href={`/admin/jobs/${row.original.id}/applicants`}>
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View Applicants
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
