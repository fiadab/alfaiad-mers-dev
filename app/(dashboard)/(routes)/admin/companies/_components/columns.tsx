"use client";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type CompanyColumns = {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
}

export const columns: ColumnDef<CompanyColumns>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const { logo } = row.original;
      return (
        <div className="w-20 h-20 flex items-center justify-center relative rounded-md">
          <Image
            src={
              logo.startsWith('http') 
                ? logo 
                : `https://files.edgestore.dev/myPublicImages/${logo}`
            }
            alt="Logo"
            fill
            quality={80}
            className="object-contain rounded-md"
            sizes="80px"
            onError={(e) => {
              e.currentTarget.src = '/default-logo.png';
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
  },
  {
  id: "actions",
  cell: ({row}) => {
    const {id} = row.original;
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant={"ghost"}
            size={"icon"}
            >
                <MoreHorizontal className="h-4 w-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <Link href={`/admin/companies/${id}`}>
        <DropdownMenuItem>
            <Pencil className="w-4 h-4 mr-2"/>
            Edit
        </DropdownMenuItem>
        </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
   },
  },
];