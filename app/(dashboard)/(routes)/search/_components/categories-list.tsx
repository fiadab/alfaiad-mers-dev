"use client";

import { Category } from "@prisma/client";
import CategoryListItem from "./category-list-item";

interface CategoriesListProps {
  categories: Category[];
}

export const CategoriesList = ({ categories }: CategoriesListProps) => {
  if (!categories || categories.length === 0) {
    return <p className="text-center text-gray-500">No categories available.</p>;
  }

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
};