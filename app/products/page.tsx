"use client";

import ProductsAdCard from "@/components/storefront/ProductsAdCard";
import ProductsGallerySection from "@/components/storefront/ProductsGallerySection";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import React, { Suspense } from "react";

export const dynamic = 'force-dynamic';

function ProductsGalleryFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="hidden md:block">
          <div className="bg-white border rounded-xl p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 space-y-3">
                <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <main className="w-full">
       {/* <CategoryNavigation /> */}
      <div className="max-w-6xl mx-auto px-4 py-4 relative">
        <div className="mb-4">
          <Suspense fallback={<div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>}>
            <Breadcrumb />
          </Suspense>
        </div>
      </div>
     
      {/* <ProductsAdCard /> */}
      <Suspense fallback={<ProductsGalleryFallback />}>
        <ProductsGallerySection initialProducts={[]} />
      </Suspense>
    </main>
  );
}
