"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import wishlistService from '@/services/api/wishlist';
import ProductCard from '@/components/storefront/ProductCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });
  const wishlist = data?.data || [];

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      toast.success('Removed from wishlist');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from wishlist');
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item: any) => (
            <div key={item.product?._id || item.productId?._id || item._id} className="relative">
              <ProductCard
                id={item.product?._id || item.productId?._id || item._id}
                title={item.product?.name || item.productId?.name || ''}
                image={item.product?.imageCover || item.productId?.imageCover || ''}
                price={item.product?.price?.toLocaleString() || item.productId?.price?.toLocaleString() || ''}
                unit={item.product?.priceUnit || item.productId?.priceUnit || ''}
                rating={item.product?.rating || item.productId?.rating || 0}
                reviews={item.product?.reviews?.length?.toString() || item.productId?.reviews?.length?.toString() || '0'}
                isFavorite={true}
                onFavoriteToggle={() => removeMutation.mutate(item.product?._id || item.productId?._id || item._id)}
              />
              <button
                className="absolute top-2 left-2 px-3 py-1 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-50 transition text-xs z-10"
                onClick={() => removeMutation.mutate(item.product?._id || item.productId?._id || item._id)}
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