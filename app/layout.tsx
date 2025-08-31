"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/providers/auth-provider";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCart } from "@/store/cartSlice";
import PartnerWithUs from "@/components/storefront/PartnerWithUs";
import VendorHeader from "@/components/vendor/VendorHeader";
import { CategoryNavigation } from "@/components/storefront/CategoryNavigation";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

declare global {
  interface Window {
    botpressWidgetAdded?: boolean;
  }
}

function CartPersistenceWatcher() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  // Load cart from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("cart");
      if (data) {
        dispatch(setCart(JSON.parse(data)));
      }
    }
  }, [dispatch]);
  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  return null;
}

// Removed Botpress widget in favor of custom ChatWidget

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isVendor = pathname.startsWith("/vendor");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <NextAuthProvider>
          <ClientProviders>
            <Suspense fallback={<div></div>}>
              {!isAdmin && !isVendor && <Header />}
              {!isAdmin && !isVendor && <CategoryNavigation />}
            </Suspense>
            {isVendor && <VendorHeader />}
            <main className="flex-grow">
              <CartPersistenceWatcher />
              {children}
            </main>
            <div className="w-full">
              {!isAdmin && !isVendor && <PartnerWithUs />}
            </div>
            {!isAdmin && !isVendor && <Footer />}
            {/* Replace Botpress with our custom ChatWidget */}
            {!isAdmin && !isVendor && <ChatWidget />}
          </ClientProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
