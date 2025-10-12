"use client";
import RefundRequestsEmpty from "@/components/account/RefundRequestsEmpty";
import RefundRequestsList from "@/components/account/RefundRequestsList";
import { useState } from "react";

export default function RefundRequestsPage() {
  // Simulate refund requests presence
  const [hasRefunds] = useState(false); // Change to true to test list

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Refund Requests
        </h1>
        <p className="text-sm text-gray-500">
          View the status of your refund requests and get updates on next steps.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {hasRefunds ? <RefundRequestsList /> : <RefundRequestsEmpty />}
      </div>
    </div>
  );
}
