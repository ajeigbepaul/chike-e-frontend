"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProducts, updateProduct } from "@/services/api/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Package, Save, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccessoriesManager() {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [accessories, setAccessories] = useState<
    Array<{ _id:string; name: string; products: string[] }>
  >([]);

  // Fetch all products for selection
  const {
    data: productsData = { products: [] },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-products-for-accessories"],
    queryFn: () => getProducts(1, 1000),
  });
  const allProducts = productsData.products;

  // Find selected product
  const selectedProduct = allProducts.find((p) => p._id === selectedProductId);

  // When product changes, load its accessories
  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    const prod = allProducts.find((p) => p._id === id);
    // Convert Product objects to product IDs in accessories
    const processedAccessories = (prod?.accessories || []).map(accessory => ({
      _id: accessory._id,
      name: accessory.name,
      products: accessory.products.map(product => 
        typeof product === 'string' ? product : product._id
      )
    }));
    setAccessories(processedAccessories);
  };

  // Mutation to update product accessories
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      accessories.forEach((acc, i) => {
        formData.append(`accessories[${i}][name]`, acc.name);
        acc.products.forEach((pid, j) => {
          formData.append(`accessories[${i}][products][${j}]`, pid);
        });
      });
      return updateProduct(selectedProductId, formData);
    },
    onSuccess: () => toast.success("Accessories updated successfully!"),
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update accessories"),
  });

  const addAccessory = () => {
    setAccessories([...accessories, { _id: "", name: "", products: [] }]);
  };

  const removeAccessory = (index: number) => {
    setAccessories(accessories.filter((_, idx) => idx !== index));
  };

  const updateAccessoryName = (index: number, name: string) => {
    const updated = [...accessories];
    updated[index].name = name;
    setAccessories(updated);
  };

  const updateAccessoryProducts = (index: number, productIds: string[]) => {
    const updated = [...accessories];
    updated[index].products = productIds;
    setAccessories(updated);
  };

  const getSelectedProductNames = (productIds: string[]) => {
    return productIds
      .map((id) => allProducts.find((p) => p._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Accessories Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Manage product accessories and related items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <Badge variant="secondary" className="text-sm">
              {allProducts.length} Products Available
            </Badge>
          </div>
        </div>

        {/* Product Selection Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedProductId}
                onValueChange={handleSelectProduct}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a product to manage accessories..." />
                </SelectTrigger>
                <SelectContent>
                  {allProducts.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        {product.accessories &&
                          product.accessories.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {product.accessories.length} accessories
                            </Badge>
                          )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  Failed to load products. Please try again.
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">
                    Loading products...
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Product Info */}
        {selectedProduct && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Manage accessories for this product
                  </p>
                </div>
                <Badge variant="default" className="bg-blue-600">
                  ₦{selectedProduct.price?.toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accessories Management */}
        {selectedProductId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Accessories Configuration
                </span>
                <Button
                  onClick={addAccessory}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accessory
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {accessories.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No accessories configured
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add accessories to help customers discover related
                      products
                    </p>
                    <Button
                      onClick={addAccessory}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Accessory
                    </Button>
                  </div>
                ) : (
                  accessories.map((accessory, index) => (
                    <Card
                      key={index}
                      className="border-2 border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Accessory Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-900">
                                Accessory #{index + 1}
                              </span>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAccessory(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Accessory Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Accessory Name
                            </label>
                            <Input
                              value={accessory.name}
                              placeholder="e.g., Protective Case, Charging Cable, etc."
                              onChange={(e) =>
                                updateAccessoryName(index, e.target.value)
                              }
                              className="w-full"
                            />
                          </div>

                          {/* Product Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Related Products
                            </label>
                            <Select
                              value=""
                              onValueChange={(value) => {
                                if (
                                  value &&
                                  !accessory.products.includes(value)
                                ) {
                                  updateAccessoryProducts(index, [
                                    ...accessory.products,
                                    value,
                                  ]);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select products to include..." />
                              </SelectTrigger>
                              <SelectContent>
                                {allProducts
                                  .filter(
                                    (p) =>
                                      p._id !== selectedProductId &&
                                      !accessory.products.includes(p._id)
                                  )
                                  .map((product) => (
                                    <SelectItem
                                      key={product._id}
                                      value={product._id}
                                    >
                                      {product.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>

                            {/* Selected Products Display */}
                            {accessory.products.length > 0 && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                  Selected Products ({accessory.products.length}
                                  )
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {accessory.products.map((productId) => {
                                    const product = allProducts.find(
                                      (p) => p._id === productId
                                    );
                                    return product ? (
                                      <Badge
                                        key={productId}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                      >
                                        {product.name}
                                        <button
                                          onClick={() => {
                                            updateAccessoryProducts(
                                              index,
                                              accessory.products.filter(
                                                (id) => id !== productId
                                              )
                                            );
                                          }}
                                          className="ml-1 hover:text-red-600"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                {/* Save Button */}
                {accessories.length > 0 && (
                  <div className="flex justify-end pt-6 border-t">
                    <Button
                      onClick={() => mutation.mutate()}
                      disabled={mutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Accessories
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
