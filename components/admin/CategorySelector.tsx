"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Category } from '@/app/admin/categories/types';

type CategorySelectorProps = {
  categories: Category[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function CategorySelector({
  categories,
  value,
  onChange,
}: CategorySelectorProps) {
  const handleCheck = (categoryId: string, checked: boolean) => {
    if (checked) {
      // If we want to allow only one selection
      onChange([categoryId]);
    } else {
      onChange([]);
    }
  };

  const renderCategory = (category: Category, level = 0) => {
    return (
      <div key={category._id} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={category._id}
            checked={value.includes(category._id)}
            onCheckedChange={(checked) =>
              handleCheck(category._id, checked as boolean)
            }
          />
          <label
            htmlFor={category._id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {category.name}
          </label>
        </div>
        {category.subcategories && category.subcategories.length > 0 && (
          <div className={cn("ml-6 space-y-2", level > 0 && "border-l pl-4")}>
            {category.subcategories.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build category tree
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const map: { [key: string]: Category & { subcategories: Category[] } } = {};
    const roots: (Category & { subcategories: Category[] })[] = [];

    // Initialize map and subcategories
    categories.forEach(cat => {
      map[cat._id] = { ...cat, subcategories: [] };
    });

    // Build the tree
    categories.forEach(cat => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].subcategories.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    // Sort root categories by order
    roots.sort((a, b) => a.order - b.order);

    // Recursively sort subcategories
    function sortSubcategories(category: Category & { subcategories: Category[] }) {
      category.subcategories.sort((a, b) => a.order - b.order);
      category.subcategories.forEach(sub => sortSubcategories(sub as Category & { subcategories: Category[] }));
    }

    roots.forEach(sortSubcategories);

    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4 pr-4">
        {categoryTree.map((category) => renderCategory(category))}
      </div>
    </ScrollArea>
  );
}
