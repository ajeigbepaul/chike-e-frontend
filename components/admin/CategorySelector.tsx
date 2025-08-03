"use client";

import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Category } from "@/app/admin/categories/types";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheck = (categoryId: string, checked: boolean) => {
    if (checked) {
      // If we want to allow only one selection
      onChange([categoryId]);
    } else {
      onChange([]);
    }
  };

  const toggleCategory = (id: string) => {
    setOpenCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderCategory = (category: Category, level = 0) => {
    const isOpen = openCategoryIds.has(category._id);
    const isSelected = value.includes(category._id);

    return (
      <div key={category._id} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={category._id}
            checked={isSelected}
            onCheckedChange={(checked) =>
              handleCheck(category._id, checked as boolean)
            }
          />
          <label
            htmlFor={category._id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
          >
            {category.name}
          </label>
          {category.subcategories && category.subcategories.length > 0 && (
            <button
              type="button"
              onClick={() => toggleCategory(category._id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {category.subcategories &&
          category.subcategories.length > 0 &&
          isOpen && (
            <div className={cn("ml-6 space-y-2", level > 0 && "border-l pl-4")}>
              {category.subcategories.map((child) =>
                renderCategory(child, level + 1)
              )}
            </div>
          )}
      </div>
    );
  };

  // Build category tree
  const buildCategoryTree = (categories: Category[]): Category[] => {
    if (!Array.isArray(categories)) return [];

    const map: { [key: string]: Category & { subcategories: Category[] } } = {};
    const roots: (Category & { subcategories: Category[] })[] = [];

    // Initialize map and subcategories
    categories.forEach((cat) => {
      map[cat._id] = { ...cat, subcategories: [] };
    });

    // Build the tree
    categories.forEach((cat) => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].subcategories.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    // Sort root categories by order
    roots.sort((a, b) => a.order - b.order);

    // Recursively sort subcategories
    function sortSubcategories(
      category: Category & { subcategories: Category[] }
    ) {
      category.subcategories.sort((a, b) => a.order - b.order);
      category.subcategories.forEach((sub) =>
        sortSubcategories(sub as Category & { subcategories: Category[] })
      );
    }

    roots.forEach(sortSubcategories);

    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  // Get selected category name for display
  const getSelectedCategoryName = () => {
    if (value.length === 0) return "Select category";
    const selectedCategory = categories.find((cat) => cat._id === value[0]);
    return selectedCategory ? selectedCategory.name : "Select category";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value.length === 0 ? "text-muted-foreground" : ""}>
          {getSelectedCategoryName()}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[300px] overflow-hidden">
          <ScrollArea className="h-[300px] w-full p-4">
            <div className="space-y-4 pr-4">
              {categoryTree.map((category) => renderCategory(category))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
