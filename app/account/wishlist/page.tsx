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
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : validWishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Start adding products to your wishlist to see them here.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-brand-yellow text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                className="absolute top-2 left-2 px-3 py-1 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-50 transition text-xs z-10"
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
