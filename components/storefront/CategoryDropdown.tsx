"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Category } from "@/app/admin/categories/types";
import { usePathname } from "next/navigation";

interface CategoryDropdownProps {
  categories: Category[];
  trigger?: React.ReactNode;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  onCategorySelect?: (categoryId: string) => void;
}

export function CategoryDropdown({
  categories,
  trigger,
  isMobile,
  onCategorySelect,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [hoverPath, setHoverPath] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHoverPath([]);
        setActivePath([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build category tree (keep your existing implementation)
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

  // Defensive: always use an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  const categoryTree = buildCategoryTree(safeCategories);

  // Check if a category is in the current hover path
  const isInHoverPath = (categoryId: string) => {
    return hoverPath.includes(categoryId);
  };

  // Toggle category expansion (mobile)
  const toggleCategory = (categoryId: string) => {
    setActivePath((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Get the hover path for a category
  const getHoverPath = (category: Category): string[] => {
    const path: string[] = [category._id];
    let current = category;
    while (current.parent) {
      path.unshift(current.parent);
      current = categories.find((c) => c._id === current.parent)!;
    }
    return path;
  };

  // Recursive component to render category levels
  const renderCategoryLevel = (
    categoryList: Category[],
    level = 0,
    parentPath: string[] = []
  ) => {
    return (
      <div
        className={`py-1 ${level > 0 ? "min-w-[240px]" : ""}`}
        onMouseLeave={() => !isMobile && level > 0 && setHoverPath(parentPath)}
      >
        {categoryList.map((category) => {
          const currentPath = [...parentPath, category._id];
          const shouldShow =
            level === 0 ||
            (isMobile
              ? activePath.includes(category._id)
              : isInHoverPath(category._id));

          return (
            <div
              key={category._id}
              className="relative group"
              onMouseEnter={() =>
                !isMobile && setHoverPath(getHoverPath(category))
              }
            >
              <div className="flex items-center">
                {onCategorySelect ? (
                  <button
                    className={`flex-1 px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow transition-colors whitespace-nowrap text-left`}
                    onClick={() => {
                      onCategorySelect(category._id);
                      setIsOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                ) : (
                  <Link
                    href={`/products?category=${category._id}`}
                    className={`flex-1 px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow transition-colors whitespace-nowrap ${
                      isInHoverPath(category._id) && !isMobile
                        ? "bg-brand-yellow/10 text-brand-yellow"
                        : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                )}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <button
                      className="p-2"
                      onClick={() => isMobile && toggleCategory(category._id)}
                    >
                      {isMobile ? (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activePath.includes(category._id)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
              </div>

              {/* Subcategories menu */}
              {category.subcategories &&
                category.subcategories.length > 0 &&
                shouldShow && (
                  <div
                    className={`${
                      isMobile
                        ? "relative bg-gray-50 ml-4 border-l border-gray-200"
                        : "submenu absolute left-full top-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px]"
                    } ${
                      !isMobile
                        ? isInHoverPath(category._id)
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                        : ""
                    }`}
                    style={{
                      marginLeft: !isMobile && level >= 2 ? "0" : "-1px",
                    }}
                  >
                    {renderCategoryLevel(
                      category.subcategories,
                      level + 1,
                      currentPath
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <div
          className="flex items-center"
          onMouseLeave={() => !isOpen && !isMobile && setHoverPath([])}
        >
          <Link
            href="/products"
            className={`${
              pathname.startsWith("/products")
                ? "text-brand-yellow"
                : "text-foreground"
            } hover:text-brand-yellow transition-colors`}
          >
            Products
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 ${
              pathname.startsWith("/products")
                ? "text-brand-yellow"
                : "text-foreground"
            } hover:text-brand-yellow transition-colors focus:outline-none`}
            aria-expanded={isOpen}
            aria-label="Toggle products dropdown"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className={`${
            isMobile
              ? "fixed inset-0 bg-white z-50 overflow-y-auto pt-16 pb-8 px-4"
              : "absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]"
          }`}
          onMouseLeave={() => {
            if (!isMobile) {
              setIsOpen(false);
              setHoverPath([]);
            }
          }}
        >
          {isMobile && (
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-semibold">Categories</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
          {renderCategoryLevel(categoryTree)}
        </div>
      )}
    </div>
  );
}
