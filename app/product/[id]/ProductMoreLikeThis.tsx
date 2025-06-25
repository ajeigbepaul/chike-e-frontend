import Image from 'next/image';
import type { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { getRelatedProducts } from '@/services/api/products';
import ProductCard from '@/components/storefront/ProductCard';

export default function ProductMoreLikeThis({ product }: { product: Product }) {
  const { data: related, isLoading, isError } = useQuery({
    queryKey: ['related-products', product._id],
    queryFn: () => getRelatedProducts(product._id),
    enabled: !!product._id,
  });

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">More products like this</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-500">Could not load related products.</div>
      ) : related && related.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-2">
          {related.map((p) => (
            <div key={p._id} className="min-w-[220px]">
              <ProductCard
                id={p._id}
                title={p.name}
                image={p.imageCover}
                price={p.price.toLocaleString()}
                unit={p.priceUnit}
                rating={p.rating || 0}
                reviews={p.reviews ? p.reviews.length.toString() : '0'}
                isFavorite={false}
                onFavoriteToggle={() => {}}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>No related products found.</div>
      )}
    </div>
  );
} 