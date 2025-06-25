import ProductCard, { ProductCardSkeleton } from './ProductCard';
import React from 'react';
import { getProducts } from '@/services/api/products';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const MostOrderedProducts = () => {
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(1, 20),
  });
  const products: Product[] = productsResponse?.products || [];
  const largeProduct: Product | undefined = products[0];

  const handleFavoriteToggle = (id: string) => {};

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="inline-block bg-[#F7B50E1A] text-brand-yellow px-4 py-1 rounded-full text-sm font-medium mb-2">
            -20% OFF all products
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Enjoy some of our most<br />ordered products
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Volutpat commodo sed egestas egestas fringilla phasellus. Tincidunt eget nullam non nisi. Nisi porta lorem mollis aliquam ut porttitor leo.
          </p>
        </div>
        <button className="self-start md:self-center px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition text-lg">
          Shop now
        </button>
      </div>
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: 4 small products in 2x2 grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  image={product.imageCover}
                  price={product.price.toLocaleString()}
                  unit={product.priceUnit}
                  rating={0}
                  reviews="0"
                  isFavorite={false}
                  onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                />
              ))}
        </div>
        {/* Right: 1 large product */}
        <div className="flex flex-col h-full justify-center">
          {isLoading ? (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="relative w-full h-80 md:h-full rounded-xl overflow-hidden bg-gray-200" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1 w-full">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <div className="w-4 h-4 bg-gray-300 rounded" />
                    <div className="w-8 h-4 bg-gray-300 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="ml-2 w-10 h-10 bg-gray-200 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ) : largeProduct ? (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative w-full h-80 md:h-full rounded-xl overflow-hidden">
                <Image
                  src={largeProduct.imageCover}
                  alt={largeProduct.name}
                  fill
                  className="object-cover w-full h-full"
                />
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
                  <Heart fill={largeProduct.isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
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
        </div>
      </div>
    </section>
  );
};

export default MostOrderedProducts;