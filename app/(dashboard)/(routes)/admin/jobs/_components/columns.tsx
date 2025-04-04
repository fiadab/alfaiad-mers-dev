// app/(admin)/admin/jobs/_components/columns.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type JobColumns = {
  id: string;
  title: string;
  company: string | null;
  category: string | null;
  isPublished: boolean;
  createdAt: Date;
  applications: number;
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
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.getValue("company") || "No Company"}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.getValue("category") || "Uncategorized"}
      </span>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`font-semibold ${
          row.getValue("isPublished") ? "text-green-500" : "text-red-500"
        }`}
      >
        {row.getValue("isPublished") ? "Published" : "Draft"}
      </div>
    ),
  },
  {
    accessorKey: "applications",
    header: "Applications",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {row.getValue("applications")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Posted",
    cell: ({ row }) => (
      <span className="text-gray-500">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </span>
    ),
  },
];