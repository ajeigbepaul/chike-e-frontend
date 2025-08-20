import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import React from "react";
import type { Product } from "@/types/product";
import Link from "next/link";

interface FeaturedProductsProps {
  products: Product[];
  wishlist: Set<string>;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const FeaturedProducts = ({
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  isLoggedIn,
  onRequireLogin,
}: FeaturedProductsProps) => {
  // const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Top selling products
        </h2>
      </div>

      {/* <hr className="border-gray-200 mb-4" /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.name}
                image={product.imageCover}
                price={product.price.toLocaleString()}
                unit={product.priceUnit}
                rating={product.rating || 0}
                reviews={
                  product.reviews ? product.reviews.length.toString() : "0"
                }
                isFavorite={wishlist.has(product._id)}
                onFavoriteToggle={() => onToggleWishlist(product)}
                onAddToCart={() => onAddToCart(product)}
                isLoggedIn={isLoggedIn}
                onRequireLogin={onRequireLogin}
                quantity={product.quantity || 0}
                moq={product.moq || 1}
              />
            ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/products">
          <button className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition">
            Explore more
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
