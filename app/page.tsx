"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import wishlistService from "@/services/api/wishlist";
import {
  getProducts,
  getMostOrderedProducts,
} from "@/services/api/products";
import type { Product } from '@/types/product';

import HeroSection from "@/components/storefront/Hero";
import ProductCategories from "@/components/storefront/ProductCategories";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import TrendingProducts from "@/components/storefront/TrendingProducts";
import OurNewestArrivals from "@/components/storefront/OurNewestArrivals";
import WhyUs from "@/components/storefront/WhyUs";
import MostOrderedProducts from "@/components/storefront/MostOrdered";
import PartnerWithUs from "@/components/storefront/PartnerWithUs";
// import other sections as needed

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();
  const dispatch = useDispatch();

  // Product data state
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [newest, setNewest] = useState<Product[]>([]);
  const [mostOrdered, setMostOrdered] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Fetch all product data
  useEffect(() => {
    // Featured: first 8 products (or use a featured flag if you have one)
    getProducts(1, 8).then(res => setFeatured(res.products));

    // Trending: top 8 by rating (simulate, or use a real endpoint if you have one)
    getProducts(1, 20).then(res => {
      const sorted = [...res.products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTrending(sorted.slice(0, 8));
    });

    // Newest: top 8 by createdAt
    getProducts(1, 20).then(res => {
      const sorted = [...res.products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNewest(sorted.slice(0, 8));
    });

    // Most Ordered: use getMostOrderedProducts
    getMostOrderedProducts().then(products => {
      setMostOrdered(products);
    });
  }, []);

  // Fetch wishlist for logged-in user
  useEffect(() => {
    if (isLoggedIn) {
      wishlistService.getWishlist().then(res => {
        const ids = (res.data || []).map((item: any) => item.product?._id || item.productId?._id || item._id);
        setWishlist(new Set(ids));
      });
    } else {
      setWishlist(new Set());
    }
  }, [isLoggedIn]);

  // Add to cart handler
  const handleAddToCart = useCallback(
    (product: any) => {
      if (!isLoggedIn) {
        router.push("/auth/signin");
        return;
      }
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.imageCover,
        })
      );
      toast.success("Added to cart");
    },
    [isLoggedIn, router, dispatch]
  );

  // Wishlist toggle handler
  const handleToggleWishlist = useCallback(
    async (product: any) => {
      if (!isLoggedIn) {
        router.push("/auth/signin");
        return;
      }
      const id = product._id;
      if (wishlist.has(id)) {
        setWishlist(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        try {
          await wishlistService.removeFromWishlist(id);
          toast.success("Removed from wishlist");
        } catch (error: any) {
          toast.error(error.message);
          setWishlist(prev => new Set(prev).add(id)); // revert
        }
      } else {
        setWishlist(prev => new Set(prev).add(id));
        try {
          await wishlistService.addToWishlist(id);
          toast.success("Added to wishlist");
        } catch (error: any) {
          toast.error(error.message);
          setWishlist(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          }); // revert
        }
      }
    },
    [isLoggedIn, router, wishlist]
  );

  // Login redirect
  const handleRequireLogin = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  return (
    <main className="w-full">
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts
        products={featured}
        wishlist={wishlist}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
      />
      <TrendingProducts
        products={trending}
        wishlist={wishlist}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
      />
      <WhyUs />
      <OurNewestArrivals
        products={newest}
        wishlist={wishlist}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
      />
      <MostOrderedProducts
        products={mostOrdered}
        wishlist={wishlist}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
      />
      <PartnerWithUs />
      {/* Add more sections here */}
      {/* <FeaturedProducts /> */}
      {/* <Testimonials /> */}
      {/* <Footer /> */}
    </main>
  );
}
