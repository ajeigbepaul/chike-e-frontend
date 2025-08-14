/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

import type { Product } from '@/types/product';
import Link from 'next/link';

interface TrendingProductsProps {
  products: Product[];
  wishlist: Set<string>;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const TrendingProducts = ({
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  isLoggedIn,
  onRequireLogin,
}: TrendingProductsProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-gray-900">Trending products</h2>
        <div className="flex gap-3">
          <button
            ref={prevRef}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow bg-white hover:bg-brand-yellow hover:text-white transition"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow bg-white hover:bg-brand-yellow hover:text-white transition"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={swiper => {
          // @ts-expect-error
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="mb-8"
      >
        {products.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map(product => (
              <SwiperSlide key={product._id}>
                <ProductCard
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
                  quantity={product.quantity || 0}
                />
              </SwiperSlide>
            ))}
      </Swiper>
      <div className="flex justify-center mt-4">
      <Link href="/products">

        <button className="px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition text-lg">Shop now</button>
      </Link>
      </div>
    </section>
  );
};

export default TrendingProducts; 