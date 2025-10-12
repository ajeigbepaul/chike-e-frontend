// frontend/app/account/page.tsx
"use client";

import userService from "@/services/api/user";
import { useQuery } from "@tanstack/react-query";

export default function AccountPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.getCurrentUser(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
      </div>
    );
  }
  // Mock data
  const user = {
    name: "paul ajeigbe",
    email: "pdave4krist@yahoo.com",
    address: {
      name: "paul ajeigbe",
      details:
        "Nos 28, Alonge street, Almustapha, Megida, Ayobo, Lagos Iyana Ipaja (Ayobo Road), Lagos",
      phone: "+234 8104560227",
    },
    storeCredit: 0,
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Account Overview
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Account Details
            </h2>
            <div className="mt-3 text-base font-semibold text-gray-900">
              {data?.data?.user?.name}
            </div>
            <div className="text-sm text-gray-500">
              {data?.data?.user?.email}
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
            <p>
              Keep your account information up to date to enjoy a smoother
              checkout experience.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Orders
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Review your recent purchases, track deliveries, and download
            invoices.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Wishlist
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Save items you love and get quick access across devices.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Support
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Visit the inbox to see updates or request assistance from our team.
          </p>
        </div>
      </div>
    </div>
  );
}
