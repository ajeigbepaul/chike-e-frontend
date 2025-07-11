/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/api/category";
import { Category } from "@/app/admin/categories/types";

const ProductCategories = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Fetch categories from API
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAllCategories,
  });

  // Filter to get only main categories (no parent) and active ones
  const mainCategories =
    categoriesResponse?.data?.filter(
      (category: Category) => !category.parent && category.isActive
    ) || [];

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Product Categories
          </h2>
          <p className="text-[16px] text-gray-600 max-w-3xl mx-auto">
            We're redefining construction material procurement with an extensive
            selection spanning structural materials, interior finishes, and
            exterior solutions—built to meet every project requirement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Product Categories
          </h2>
          <p className="text-[16px] text-gray-600 max-w-3xl mx-auto">
            We're redefining construction material procurement with an extensive
            selection spanning structural materials, interior finishes, and
            exterior solutions—built to meet every project requirement.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">
            Unable to load categories at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Show empty state if no categories
  if (mainCategories.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Product Categories
          </h2>
          <p className="text-[16px] text-gray-600 max-w-3xl mx-auto">
            We're redefining construction material procurement with an extensive
            selection spanning structural materials, interior finishes, and
            exterior solutions—built to meet every project requirement.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No categories available at the moment.
          </p>
        </div>
      </section>
    );
  }

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
        {mainCategories.length > 3 && (
          <div className="absolute right-0 top-0 flex gap-2 z-10">
            <button
              ref={prevRef}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
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
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-yellow border border-brand-yellow text-white hover:bg-brand-yellow hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
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
          {mainCategories.map((category: Category) => (
            <SwiperSlide
              key={category._id}
              className="group overflow-hidden rounded-xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image || "/default-category.jpg"} // Fallback to default image
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-4 text-gray-900">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="mb-4 text-sm">
                  Explore our comprehensive selection of{" "}
                  {category.name.toLowerCase()} designed to meet your project
                  requirements.
                </p>
                <Link
                  href={`/categories/${category._id}`}
                  className="inline-flex text-sm p-2 rounded-full items-center text-brand-yellow font-medium hover:text-yellow-400 border bg-[#F7B50E1A] border-brand-yellow transition-colors"
                >
                  Explore {category.name.toLowerCase()}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
