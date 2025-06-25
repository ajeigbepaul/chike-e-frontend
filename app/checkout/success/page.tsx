"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
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