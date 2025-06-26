import ProductCard, { ProductCardSkeleton } from './ProductCard';
import React from 'react';
import type { Product } from '@/types/product';

// const categories = [
//   'Reviews',
//   'Indoor',
//   'Outdoor',
//   'Construction',
//   'Plumbing',
//   'Kitchen ware',
// ];

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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top selling products</h2>
      </div>
      {/* <div className="flex gap-6 mb-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`text-base font-medium pb-1 border-b-2 transition-colors ${
              activeCategory === cat
                ? 'border-brand-yellow text-brand-yellow'
                : 'border-transparent text-gray-700 hover:text-brand-yellow'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div> */}
      {/* <hr className="border-gray-200 mb-4" /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.name}
                image={product.imageCover}
                price={product.price.toLocaleString()}
                unit={product.priceUnit}
                rating={product.rating || 0}
                reviews={product.reviews ? product.reviews.length.toString() : '0'}
                isFavorite={wishlist.has(product._id)}
                onFavoriteToggle={() => onToggleWishlist(product)}
                onAddToCart={() => onAddToCart(product)}
                isLoggedIn={isLoggedIn}
                onRequireLogin={onRequireLogin}
              />
            ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition">Explore more</button>
      </div>
    </section>
  );
};

export default FeaturedProducts; 