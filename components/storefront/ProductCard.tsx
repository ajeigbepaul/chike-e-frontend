import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({
  id,
  title,
  image,
  price,
  unit,
  rating,
  reviews,
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  blurDataURL,
  priority = false,
  isLoggedIn = false,
  onRequireLogin,
  quantity = 1,
}: {
  id: string | number;
  title: string;
  image: string;
  price: string;
  unit: string;
  rating: number;
  reviews: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onAddToCart?: () => void;
  blurDataURL?: string;
  priority?: boolean;
  isLoggedIn?: boolean;
  onRequireLogin?: () => void;
  quantity?: number;
}) {
  return (
    <Link href={`/product/${id}`} className="relative bg-white rounded-xl border shadow-sm overflow-hidden group flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="relative h-56 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurDataURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4='}
          quality={70}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          loading={priority ? undefined : 'lazy'}
          priority={priority}
        />
        {quantity === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">Out of stock</span>
        )}
        <button
          type="button"
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition z-10"
          onClick={e => {
            e.preventDefault();
            if (isLoggedIn) {
              onFavoriteToggle?.();
            } else if (onRequireLogin) {
              onRequireLogin();
            }
          }}
        >
          <Heart fill={isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
        </button>
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1 w-full">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
            <span className="font-semibold text-gray-900">{rating}</span>
            <span>({reviews} reviews)</span>
          </div>
          <button
            type="button"
            className={`ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10 ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={e => {
              e.preventDefault();
              if (quantity === 0) return;
              if (isLoggedIn) {
                onAddToCart?.();
              } else if (onRequireLogin) {
                onRequireLogin();
              }
            }}
            disabled={quantity === 0}
          >
            {quantity === 0 ? (
              <span className="text-xs font-semibold">Out</span>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{title}</h3>
        <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
          <span>{price}/ <span className="text-xs">{unit}</span></span>
          <span className="text-xs text-gray-400 ml-1 mt-1">Delivery: 7 - 9 days</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      <div className="relative h-56 w-full bg-gray-200" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1 w-full">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="w-8 h-4 bg-gray-300 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
          <div className="ml-2 w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
} 