"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic'

function SuccessContent() {
  const searchParams = useSearchParams();
  // You can use searchParams here if needed
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-center">Thank you for your order!</h1>
        <p className="text-gray-600 text-center mb-6">
          Your order has been placed successfully.<br />
          We appreciate your business and will process your order soon.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Button asChild className="w-full bg-brand-yellow text-gray-900 hover:bg-yellow-400">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/account/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded mb-2 w-64 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-80 animate-pulse"></div>
        <div className="flex flex-col gap-3 w-full">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}