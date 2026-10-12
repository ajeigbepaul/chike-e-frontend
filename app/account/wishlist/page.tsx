"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wishlistService from "@/services/api/wishlist";
import ProductCard from "@/components/storefront/ProductCard";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
  });
  const wishlist = data?.data || [];

  // Filter out wishlist items that don't have complete product data
  const validWishlistItems = wishlist.filter((item: any) => {
    const product = item.productId || item.product;
    return product && product._id && product.name && product.imageCover;
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      toast.success("Removed from wishlist");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove from wishlist");
    },
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Wishlist
        </h1>
        <p className="text-sm text-gray-500">
          Save products you love and access them quickly across all of your
          devices.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
        </div>
      ) : validWishlistItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Start adding products to keep track of your favourites and come back
            to them later.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-500"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {validWishlistItems.map((item: any) => (
            <div
              key={item.product?._id || item.productId?._id || item._id}
              className="relative"
            >
              <ProductCard
                id={item.productId._id}
                title={item.productId.name}
                image={item.productId.imageCover || "/default-product.jpg"}
                price={item.productId.price?.toLocaleString() || "0"}
                unit={item.productId.priceUnit || "unit"}
                rating={item.productId.rating || 0}
                reviews={item.productId.reviews?.length?.toString() || "0"}
                isFavorite={true}
                onFavoriteToggle={() =>
                  removeMutation.mutate(item.productId._id)
                }
              />
              <button
                className="absolute left-2 top-2 z-20 rounded-full border border-red-400 bg-white px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
                onClick={() => removeMutation.mutate(item.productId._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
