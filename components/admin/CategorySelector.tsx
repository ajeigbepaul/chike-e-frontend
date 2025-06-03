"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  children?: Category[];
};

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
      onChange([...value, categoryId]);
    } else {
      onChange(value.filter((id) => id !== categoryId));
    }
  };

  const renderCategory = (category: Category, level = 0) => {
    return (
      <div key={category.id} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={category.id}
            checked={value.includes(category.id)}
            onCheckedChange={(checked) =>
              handleCheck(category.id, checked as boolean)
            }
          />
          <label
            htmlFor={category.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {category.name}
          </label>
        </div>
        {category.children && category.children.length > 0 && (
          <div className={cn("ml-6 space-y-2", level > 0 && "border-l pl-4")}>
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {categories.map((category) => renderCategory(category))}
      </div>
    </ScrollArea>
  );
}
