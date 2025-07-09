"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/ProductTable";
import { getProducts } from "@/services/api/products";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts(page, limit),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isError) {
    return <div>Error fetching products</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push("/admin/products/new")}>
          Add New Product
        </Button>
      </div>
      {isLoading && !data ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ProductTable
          products={data?.products || []}
          pagination={data?.pagination || { total: 0, page: 1, limit: 10, pages: 0 }}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}