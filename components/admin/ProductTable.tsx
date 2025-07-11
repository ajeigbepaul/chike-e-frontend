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
import { Loader2, Minus, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/services/api/products";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteProduct as deleteProductApi } from "@/services/api/products";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductApi(productToDelete._id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
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
        <div className="rounded-md border shadow-sm">
          <Table className="w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[60px] font-semibold px-2">
                  Image
                </TableHead>
                <TableHead className="w-[180px] font-semibold px-2">
                  Name
                </TableHead>
                <TableHead className="w-[80px] font-semibold px-2">
                  Price
                </TableHead>
                <TableHead className="w-[200px] font-semibold px-2">
                  Quantity
                </TableHead>
                <TableHead className="w-[120px] font-semibold px-2">
                  Category
                </TableHead>
                <TableHead className="w-[120px] font-semibold px-2">
                  Vendor
                </TableHead>
                <TableHead className="w-[80px] font-semibold px-2">
                  Status
                </TableHead>
                <TableHead className="w-[100px] font-semibold px-2">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-2">
                    <Image
                      width={24}
                      height={24}
                      src={product.imageCover}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium px-2 text-sm">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-2">₦{product.price}</TableCell>
                  <TableCell className="px-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDecrement(product._id)}
                        className="h-6 w-6"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center text-xs" // Increased width from w-12 to w-16
                        value={updateQuantities[product._id] ?? ""}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleIncrement(product._id)}
                        className="h-6 w-6"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(product._id)}
                        disabled={
                          updateQuantities[product._id] === product.quantity ||
                          updatingProductId === product._id
                        }
                        className="text-xs px-2 py-1"
                      >
                        {updatingProductId === product._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-sm">
                    {product.categoryName ||
                      (typeof product.category === "object" &&
                      product.category !== null
                        ? product.category.name
                        : typeof product.category === "string"
                        ? product.category
                        : "Uncategorized")}
                  </TableCell>
                  <TableCell className="px-2 text-sm">
                    <div className="font-medium">
                      {product.vendorName || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="px-2">
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
                  <TableCell className="px-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/products/${product._id}`)
                        }
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      {/* Removed the Eye (View) icon button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <b>{productToDelete?.name}</b>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!productToDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
