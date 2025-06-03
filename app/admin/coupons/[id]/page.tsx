"use client";

import { useEffect, useState } from "react";
import { CouponForm } from "@/components/admin/CouponForm";
import { useParams } from "next/navigation";

// Mock data - replace with actual API calls
const mockCategories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Books" },
];

const mockProducts = [
  { id: "1", name: "Smartphone" },
  { id: "2", name: "Laptop" },
  { id: "3", name: "Headphones" },
];

const mockCustomerGroups = [
  { id: "1", name: "VIP" },
  { id: "2", name: "Regular" },
  { id: "3", name: "New" },
];

// Mock coupon data - replace with actual API call
const mockCoupon = {
  id: "1",
  code: "SUMMER20",
  description: "Summer sale discount",
  type: "percentage",
  value: "20",
  startDate: "2024-06-01",
  endDate: "2024-08-31",
  isActive: true,
  minimumPurchase: "100",
  maximumDiscount: "200",
  appliesTo: "all_products",
  categories: [],
  products: [],
  usageLimit: "200",
  customerLimit: "1",
  customerGroups: [],
  excludeProducts: [],
  excludeCategories: [],
  freeShipping: false,
  firstTimeOnly: false,
};

export default function EditCouponPage() {
  const params = useParams();
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchCoupon = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCoupon(mockCoupon);
      setLoading(false);
    };

    fetchCoupon();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    // TODO: Implement API call to update coupon
    console.log("Updating coupon:", data);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!coupon) {
    return <div>Coupon not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Coupon</h1>
      <CouponForm
        coupon={coupon}
        categories={mockCategories}
        products={mockProducts}
        customerGroups={mockCustomerGroups}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
