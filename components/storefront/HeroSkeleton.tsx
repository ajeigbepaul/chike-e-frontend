import React from "react";

const HeroSkeleton = () => {
  return (
    <section className="relative md:h-screen h-[60vh] w-full bg-gray-100">
      {/* Navigation arrows skeleton */}
      <div className="absolute z-30 left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      <div className="absolute z-30 right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 animate-pulse" />

      {/* Main content skeleton */}
      <div className="h-full w-full relative">
        {/* Background image skeleton */}
        <div className="h-full w-full bg-gray-200 animate-pulse" />

        {/* Content overlay skeleton */}
        <div className="absolute inset-0 bg-black/10 flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24">
          {/* Title skeleton */}
          <div className="h-12 md:h-16 bg-gray-300 rounded mb-4 w-[50%] animate-pulse" />

          {/* Subtitle skeleton */}
          <div className="h-6 md:h-8 bg-yellow-200 rounded mb-2 w-[40%] animate-pulse" />

          {/* Description skeleton */}
          <div className="h-4 md:h-6 bg-gray-300 rounded mb-6 w-[50%] animate-pulse" />

          {/* CTA button skeleton */}
          <div className="h-12 w-32 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      {/* Pagination dots skeleton */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSkeleton;
