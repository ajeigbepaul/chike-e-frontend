"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/api/category";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  productData?: {
    category?: {
      name: string;
      _id: string;
    } | string;
    categoryName?: string;
    name: string;
  };
}

export function Breadcrumb({ items = [], showHome = true, productData }: BreadcrumbProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  // Fetch category data using useQuery
  const { data: categoryData } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId!),
    enabled: !!categoryId && pathname === "/products",
  });

  console.log("Category data from service:", categoryData);

  // Generate breadcrumbs from pathname if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = "";

    paths.forEach((path, index) => {
      currentPath += `/${path}`;

      // Convert path to readable label
      let label = path.charAt(0).toUpperCase() + path.slice(1);

      // Handle special cases
      if (path === "product") {
        label = "Products";
      } else if (path === "cart") {
        label = "Shopping Cart";
      } else if (path === "checkout") {
        label = "Checkout";
      } else if (path === "about") {
        label = "About Us";
      } else if (path === "admin") {
        label = "Admin Dashboard";
      } else if (path === "vendor") {
        label = "Vendor Dashboard";
      } else if (path === "category") {
        label = "Categories";
      }

      // For product detail pages, handle the product ID differently
      if (paths[0] === "product" && index === 1 && productData) {
        // This is the product ID, replace with product name
        label = productData.name;
      }

      // For product detail pages, don't link the "Products" breadcrumb
      let href = index === paths.length - 1 ? undefined : currentPath;
      if (paths[0] === "product" && index === 0) {
        href = undefined; // Remove link for "Products" in product detail pages
      }

      breadcrumbs.push({
        label,
        href,
      });
    });

    // For product detail pages, add category breadcrumb after "Products"
    if (paths[0] === "product" && paths.length > 1 && productData) {
      // Get category name from product data
      let categoryName = "";
      if (typeof productData.category === "object" && productData.category?.name) {
        categoryName = productData.category.name;
      } else if (productData.categoryName) {
        categoryName = productData.categoryName;
      }

      if (categoryName) {
        // Insert category breadcrumb between "Products" and product name
        breadcrumbs.splice(1, 0, {
          label: categoryName,
          href: "/products", // Link back to products page
        });
      }
    }

    // Add category filter to breadcrumbs if present
    if (categoryId && pathname === "/products") {
      const categoryName = categoryData?.success
        ? categoryData.data?.name
        : categoryId;
      breadcrumbs.push({
        label: categoryName || categoryId, // Use fetched name or fallback to ID
        href: "/products", // Route back to products page without category filter
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}

      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}

          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
        </div>
      ))}
    </nav>
  );
}
