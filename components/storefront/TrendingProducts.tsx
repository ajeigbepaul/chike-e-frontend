import React, { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Galvanized steel, 40kg',
    image: '/feature1.jpg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Square steel pipes',
    image: '/feature2.jpg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Galvanized steel, 40kg',
    image: '/feature3.jpg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Galvanized steel, 40kg',
    image: '/feature4.jpg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Galvanized steel, 40kg',
    image: '/feature1.jpg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: false,
  },
];

const TrendingProducts = () => {
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
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
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
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="relative bg-white rounded-xl shadow-sm overflow-hidden group flex flex-col h-full">
              <div className="relative h-56 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
                  <Heart fill={product.isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1 w-full">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                    <span>({product.reviews} reviews)</span>
                  </div>
                  <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
                <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
                  <span>{product.price}/ <span className="text-xs">{product.unit}</span></span>
                  <span className="text-xs text-gray-400 ml-2 mt-1">Delivery: 7 - 9 days</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center mt-4">
        <button className="px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition text-lg">Shop now</button>
      </div>
    </section>
  );
};

export default TrendingProducts; 