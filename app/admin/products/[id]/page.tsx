"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct } from "@/services/api/products";
import categoryService from "@/services/api/category";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductFormData } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const { id } = params;

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id as string),
    enabled: !!id,
  });

  const { data: categories, isLoading: areCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  const isLoading = isProductLoading || areCategoriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const productForForm: ProductFormData | undefined = product
    ? {
        ...product,
        category:
          typeof product.category === "object"
            ? product.category._id
            : product.category,
        brand:
          typeof product.brand === "object" ? product.brand._id : product.brand,
        vendor:
          typeof product.vendor === "object"
            ? product.vendor._id
            : product.vendor,
        images: product.images || [],
        createdAt: product.createdAt
          ? new Date(product.createdAt).toISOString()
          : undefined,
        updatedAt: product.updatedAt
          ? new Date(product.updatedAt).toISOString()
          : undefined,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm
        product={productForForm}
        categories={categories || []}
        attributeSets={[]}
      />
    </div>
  );
}
