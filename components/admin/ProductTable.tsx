"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/services/api/products";
import { toast } from "react-hot-toast";

interface ProductTableProps {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function ProductTable({
  products,
  pagination,
  onPageChange,
  isLoading,
}: ProductTableProps) {
  const router = useRouter();
  const [updateQuantities, setUpdateQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({
      productId,
      formData,
    }: {
      productId: string;
      formData: FormData;
    }) => {
      setUpdatingProductId(productId);
      return updateProduct(productId, formData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
    onSettled: () => {
      setUpdatingProductId(null);
    },
  });

  useEffect(() => {
    const initialQuantities = products.reduce((acc, product) => {
      acc[product._id] = product.quantity;
      return acc;
    }, {} as { [key: string]: number });
    setUpdateQuantities(initialQuantities);
  }, [products]);

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity)) {
      setUpdateQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const handleIncrement = (productId: string) => {
    setUpdateQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setUpdateQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  const handleUpdate = (productId: string) => {
    const newQuantity = updateQuantities[productId];
    const formData = new FormData();
    formData.append("quantity", newQuantity.toString());
    updateProductMutation.mutate({ productId, formData });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pb-20">
      <div className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="min-w-[200px]">Name</TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[250px]">Quantity</TableHead>
                <TableHead className="min-w-[150px]">Category</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Image
                      width={24}
                      height={24}
                      src={product.imageCover}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₦{product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDecrement(product._id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center"
                        value={updateQuantities[product._id] ?? ""}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleIncrement(product._id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(product._id)}
                        disabled={
                          updateQuantities[product._id] === product.quantity ||
                          updatingProductId === product._id
                        }
                      >
                        {updatingProductId === product._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.categoryName ||
                      (typeof product.category === "object" &&
                      product.category !== null
                        ? product.category.name
                        : typeof product.category === "string"
                        ? product.category
                        : "Uncategorized")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/products/${product._id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // Handle delete
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} products
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
