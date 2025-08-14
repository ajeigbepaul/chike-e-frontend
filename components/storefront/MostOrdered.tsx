import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import React from "react";

import type { Product } from "@/types/product";
import Link from "next/link";

interface MostOrderedProductsProps {
  products: Product[];
  wishlist: Set<string>;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const MostOrderedProducts = ({
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  isLoggedIn,
  onRequireLogin,
}: MostOrderedProductsProps) => {
  // const largeProduct: Product | undefined = products[0];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="inline-block bg-[#F7B50E1A] text-brand-yellow px-4 py-1 rounded-full text-sm font-medium mb-2">
            -20% OFF all products
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Enjoy some of our most
            <br />
            ordered products
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Volutpat commodo sed egestas egestas fringilla phasellus. Tincidunt
            eget nullam non nisi. Nisi porta lorem mollis aliquam ut porttitor
            leo.
          </p>
        </div>
        <Link href="/products">
        <button className="self-start md:self-center px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition text-lg">
          Shop now
        </button>
        </Link>
        
      </div>
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: 4 small products in 2x2 grid */}

        {products.length === 0 ? (
          // Show "no products yet" card when there are no products
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-500 mb-4">
                We haven't received any orders yet. Be the first to discover our
                amazing products!
              </p>
              <button className="px-6 py-2 bg-brand-yellow text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition-colors">
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          products.map((product) => (
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
            />
          ))
        )}
      </div>
      {/* Right: 1 large product */}
      {/* <div className="flex flex-col h-full justify-center">
          {largeProduct ? (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative w-full h-80 md:h-full rounded-xl overflow-hidden">
                <Image
                  src={largeProduct.imageCover}
                  alt={largeProduct.name}
                  fill
                  className="object-cover w-full h-full"
                />
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
                  <Heart fill={wishlist.has(largeProduct._id) ? '#F7B50E' : 'none'} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1 w-full">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
                    <span className="font-semibold text-gray-900">{largeProduct.rating || 0}</span>
                    <span>({largeProduct.reviews ? largeProduct.reviews.length : 0} reviews)</span>
                  </div>
                  <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{largeProduct.name}</h3>
                <div className="flex items-center text-base text-gray-700 font-medium">
                  <span>{largeProduct.price.toLocaleString()}/ <span className="text-xs">{largeProduct.priceUnit}</span></span>
                  <span className="text-xs text-gray-400 ml-2">Delivery: 7 - 9 days</span>
                </div>
              </div>
            </div>
          ) : null}
        </div> */}
    </section>
  );
};

export default MostOrderedProducts;
