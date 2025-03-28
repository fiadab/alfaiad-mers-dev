"use client";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

export const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const renderFilterButtons = (paramKey: string) => {
    const paramValue = currentParams[paramKey];
    if (!paramValue) return null;

    return paramValue.split(",").map((item) => (
      <Button
        variant="outline"
        type="button"
        key={item}
        className="flex items-center gap-x-2 text-neutral-50 px-2 py-1 rounded-md bg-black border-x-sky-200 capitalize cursor-pointer hover:bg-purple-50"
      >
        {item}
      </Button>
    ));
  };

  if (searchParams.size === 0) return null;

  return (
    <>
      <div className="mt-4 items-center gap-4">
        {renderFilterButtons("shiftTiming")}
        {renderFilterButtons("workMode")}

        {searchParams.get("categoryId") && (
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-50 px-2 py-1 rounded-md bg-black border-x-sky-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {getCategoryName(searchParams.get("categoryId"))}
          </Button>
        )}
      </div>

      {searchParams.get("title") && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-3xl text-muted-foreground">
            Search for:{" "}
            <span className="font-bold text-neutral-500 capitalize">
              {searchParams.get("title")}
            </span>
          </h2>
        </div>
      )}
    </>
  );
};