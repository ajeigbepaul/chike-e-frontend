/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductCategories = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const categories = [
    {
      id: 1,
      title: "Construction materials",
      description: "High-quality structural essentials like cement, steel, blocks, aggregates, and more—engineered to support every stage of your build.",
      cta: "Explore construction materials",
      image: "/cat1.svg",
      link: "/categories/construction"
    },
    {
      id: 2,
      title: "Indoor products",
      description: "Enhance your interiors with premium flooring, wall finishes, ceilings, doors, and fittings—designed for comfort, durability, and style.",
      cta: "Explore indoor products",
      image: "/cat2.svg",
      link: "/categories/indoor"
    },
    {
      id: 3,
      title: "Outdoor products",
      description: "Weather-resistant roofing, cladding, pavements, landscaping elements, and more—crafted for performance and curb appeal.",
      cta: "Explore outdoor products",
      image: "/cat3.svg",
      link: "/categories/outdoor"
    },
    {
        id: 4,
        title: "Test products",
        description: "Weather-resistant roofing, cladding, pavements, landscaping elements, and more—crafted for performance and curb appeal.",
        cta: "Explore outdoor products",
        image: "/cat3.svg",
        link: "/categories/outdoor"
      }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Product Categories
        </h2>
        <p className="text-[16px] text-gray-600 max-w-3xl mx-auto">
          {`We're redefining construction material procurement with an extensive selection spanning 
          structural materials, interior finishes, and exterior solutions—built to meet every project requirement.`}
        </p>
      </div>
      <div className="relative">
        {categories.length > 3 && (
          <div className="absolute right-0 top-0 flex gap-2 z-10">
            <button
              ref={prevRef}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-yellow border border-brand-yellow text-white hover:bg-brand-yellow hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
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
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="group overflow-hidden rounded-xl transition-shadow duration-300">
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-4 text-gray-900">
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="mb-4 text-sm">{category.description}</p>
                <Link 
                  href={category.link}
                  className="inline-flex text-sm p-2 rounded-full items-center text-brand-yellow font-medium hover:text-yellow-400 border bg-[#F7B50E1A] border-brand-yellow transition-colors"
                >
                  {category.cta}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductCategories;