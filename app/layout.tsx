"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/providers/auth-provider";
import { ClientProviders } from "@/components/ClientProviders";
import { Header } from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { usePathname } from "next/navigation";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCart } from '@/store/cartSlice';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function CartPersistenceWatcher() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  // Load cart from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('cart');
      if (data) {
        dispatch(setCart(JSON.parse(data)));
      }
    }
    
  }, [dispatch]);
  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <NextAuthProvider>
          <ClientProviders>
            {!isAdmin && <Header />}
            <main className="flex-grow">
              <CartPersistenceWatcher />
              {children}
            </main>
            {!isAdmin && <Footer />}
          </ClientProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}