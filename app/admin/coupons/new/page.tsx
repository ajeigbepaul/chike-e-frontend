"use client";

import { CouponForm } from "@/components/admin/CouponForm";

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

export default function NewCouponPage() {
  const handleSubmit = async (data: any) => {
    // TODO: Implement API call to create coupon
    console.log("Creating coupon:", data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Coupon</h1>
      <CouponForm
        categories={mockCategories}
        products={mockProducts}
        customerGroups={mockCustomerGroups}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
