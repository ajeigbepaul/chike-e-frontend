"use client";

import HeroSection from "@/components/storefront/Hero";
import ProductCategories from "@/components/storefront/ProductCategories";
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import TrendingProducts from '@/components/storefront/TrendingProducts';
import OurNewestArrivals from '@/components/storefront/OurNewestArrivals';
import WhyUs from '@/components/storefront/WhyUs';
import MostOrderedProducts from "@/components/storefront/MostOrdered";
import PartnerWithUs from "@/components/storefront/PartnerWithUs";
// import other sections as needed

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <TrendingProducts />
     
      <WhyUs />
      <OurNewestArrivals />
      <MostOrderedProducts/>
      <PartnerWithUs/>
      {/* Add more sections here */}
      {/* <FeaturedProducts /> */}
      {/* <Testimonials /> */}
      {/* <Footer /> */}
    </main>
  );
}
