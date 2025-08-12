/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
// import hero1 from '../../public/hero1.png';
// import hero2 from '../../public/hero2.svg';

interface HeroSectionProps {
  heroSlides: Array<{ 
    id?: number; 
    title: string; 
    subtitle?: string; 
    description?: string; 
    cta?: string; 
    image: string; 
  }>;
}

const HeroSection = ({ heroSlides }: HeroSectionProps) => {
  const [mounted, setMounted] = useState(false);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative md:h-screen h-[60vh] w-full bg-gray-100">
      {/* Custom navigation arrows */}
      <div
        ref={prevRef}
        className="absolute z-30 left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-lg cursor-pointer transition hover:bg-brand-yellow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </div>
      <div
        ref={nextRef}
        className="absolute z-30 right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-lg cursor-pointer transition hover:bg-brand-yellow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="h-full w-full"
      >
        {heroSlides.map((image, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            <div className="h-full w-full relative">
              <Image
                src={image.image}
                alt={image.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 ">
                <h2 className="text-white text-4xl md:text-5xl font-bold text-left px-0 mb-4 w-[50%]">
                  {image.title}
                </h2>
                {image.subtitle && (
                  <h3 className="text-brand-yellow text-xl md:text-2xl font-semibold mb-2 text-left w-[40%]">{image.subtitle}</h3>
                )}
                {image.description && (
                  <p className="text-white text-sm md:text-lg mb-6 text-left max-w-2xl w-[50%]">{image.description}</p>
                )}
                {image.cta && (
                  <Link href={'/products'}>
                  
                  <button className="bg-white hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
                    {image.cta}
                  </button>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;