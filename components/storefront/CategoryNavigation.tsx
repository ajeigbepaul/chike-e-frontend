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
          "bg-white border-b text-brand-yellow sticky top-16 z-40",
          className
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center space-x-6 py-3">
            <div className="relative">
              <CategoryDropdown
                categories={categories}
                isMobile={isMobile}
                setIsMobile={setIsMobile}
                onCategorySelect={handleHeaderCategorySelect}
                trigger={
                  <button
                    className={`p-1 font-semibold cursor-pointer text-brand-yellow border-r-3 pr-3 transition-colors focus:outline-none`}
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
                  "flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700 rounded",
                  isActiveCategory(category?.slug)
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-white"
                )}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </Suspense>
  );
}
