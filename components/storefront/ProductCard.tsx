import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye, Truck } from "lucide-react";

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
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={
            blurDataURL ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
          }
          quality={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Out of stock badge */}
        {quantity === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium z-20 shadow-lg">
            Out of stock
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* Wishlist button */}
          <button
            type="button"
            className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isLoggedIn) {
                onFavoriteToggle?.();
              } else if (onRequireLogin) {
                onRequireLogin();
              }
            }}
          >
            <Heart
              fill={isFavorite ? "#ef4444" : "none"}
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite ? "text-red-500" : ""
              }`}
            />
          </button>

          {/* Quick view button */}
          <Link
            href={`/product/${id}`}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 text-gray-600 hover:text-brand-yellow hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to cart button overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              quantity === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-brand-yellow text-gray-900 hover:bg-yellow-500 hover:shadow-lg transform hover:scale-105"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
              <>
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Rating and reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" fill="#fbbf24" />
            <span className="font-semibold text-gray-900 text-sm">
              {rating}
            </span>
          </div>
          <span className="text-gray-500 text-sm">({reviews} reviews)</span>
        </div>

        {/* Product title */}
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3 line-clamp-2 hover:text-brand-yellow transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Price and delivery info */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{price}</span>
              <span className="text-sm text-gray-500">/{unit}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Truck className="w-3 h-3" />
              <span>Free delivery</span>
            </div>
          </div>

          {/* Stock indicator */}
          {quantity > 0 && quantity <= 5 && (
            <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
              Only {quantity} left
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-64 w-full bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="w-8 h-4 bg-gray-300 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-5 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-7 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
