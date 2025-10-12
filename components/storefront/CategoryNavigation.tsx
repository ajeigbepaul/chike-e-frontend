"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/api/category";
import { CategoryDropdown } from "./CategoryDropdown";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// We'll get main categories from the API instead of hardcoded data

interface CategoryNavigationProps {
  className?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  isActive: boolean;
  level: number;
  ancestors: { _id: string; name: string }[];
  path: string;
  order: number;
  image?: string;
  subcategories?: Category[];
}

export function CategoryNavigation({ className }: CategoryNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  // Detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Handler to update category filter in URL
  const handleHeaderCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  // Fetch categories using the same pattern as sideNav
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Filter main categories (level 0 or no parent)
  const mainCategories = categories.filter(
    (category) => category.level === 0 || !category.parent
  );

  const isActiveCategory = (slug: string) => {
    return pathname === `/category/${slug}`;
  };

  const handleCategoryClick = (category: any) => {
    router.push(`/category/${category.slug}`);
  };

  return (
    <Suspense fallback={<div className="h-16 bg-white" />}>
      <div
        className={cn(
          "sticky top-16 z-40 border-b bg-white text-brand-yellow",
          className
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <nav className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex-shrink-0">
              <CategoryDropdown
                categories={categories}
                isMobile={isMobile}
                setIsMobile={setIsMobile}
                onCategorySelect={handleHeaderCategorySelect}
                trigger={
                  <button
                    className={`p-1 font-semibold cursor-pointer text-brand-yellow pr-3 transition-colors focus:outline-none`}
                  >
                    All Category
                    {/* <ChevronDown className="h-4 w-4" /> */}
                  </button>
                }
              />
            </div>
            {/* <div className="text-sm font-medium border-r-3 pr-3">
              Main Category
            </div> */}
            {mainCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "flex flex-shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActiveCategory(category?.slug)
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className="truncate">{category.name}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle categories"
          >
            <span className="text-lg leading-none">
              {mobileMenuOpen ? "×" : "≡"}
            </span>
          </button>
        </div>

        {isMobile && mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 pb-4">
            <div className="mt-3 flex flex-wrap gap-2">
              {mainCategories.map((category) => (
                <button
                  key={`mobile-${category._id}`}
                  onClick={() => {
                    handleCategoryClick(category);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium",
                    isActiveCategory(category?.slug)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
