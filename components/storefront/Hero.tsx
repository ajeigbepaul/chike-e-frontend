/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
// import hero1 from '../../public/hero1.png';
// import hero2 from '../../public/hero2.svg';

interface HeroSectionProps {
  heroSlides: Array<{
    id?: number;
    title: string;
    subtitle?: string;
    description?: string;
    cta?: string;
    ctaRoute?: string;
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
    <section className="relative h-[220px] w-full bg-gray-100 md:h-screen">
      {/* Custom navigation arrows */}
      <div
        ref={prevRef}
        className="absolute left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-brand-yellow md:flex sm:left-6 sm:h-12 sm:w-12"
      >
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
      <div
        ref={nextRef}
        className="absolute right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-brand-yellow md:flex sm:right-6 sm:h-12 sm:w-12"
      >
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
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
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center bg-black/40 px-8 py-8 sm:px-8 md:px-12 md:py-12 lg:px-16 xl:px-24">
                <div className="max-w-3xl">
                  <h2 className="mb-5 text-2xl font-bold leading-tight text-white md:mb-4 md:text-4xl lg:text-5xl xl:text-6xl">
                    {image.title}
                  </h2>
                  {image.subtitle && (
                    <h3 className="mb-2 hidden text-base font-semibold leading-snug text-brand-yellow md:mb-4 md:block md:text-xl lg:text-2xl">
                      {image.subtitle}
                    </h3>
                  )}
                  {image.description && (
                    <p className="mb-4 hidden text-sm leading-relaxed text-white md:mb-6 md:block md:text-lg lg:text-xl">
                      {image.description}
                    </p>
                  )}
                  {image.cta && (
                    <Link href={image.ctaRoute || "/products"}>
                      <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-lg transition-colors duration-300 hover:bg-yellow-500 hover:shadow-xl sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-3 md:text-lg">
                        {image.cta}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
