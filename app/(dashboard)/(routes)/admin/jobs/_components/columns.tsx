"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Type definition for table data
export type JobColumns = {
  id: string;
  title: string;
  company: string | null;
  category: string | null;
  isPublished: boolean;
  createdAt: string;
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
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.company || "No Company"}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.category || "Uncategorized"}</span>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`font-semibold ${
          row.original.isPublished ? "text-green-500" : "text-red-500"
        }`}
      >
        {row.original.isPublished ? "Published" : "Draft"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Posted",
    cell: ({ row }) => (
      <span className="text-gray-500">{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
];