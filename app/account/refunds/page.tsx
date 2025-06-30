"use client"
import RefundRequestsEmpty from '@/components/account/RefundRequestsEmpty';
import RefundRequestsList from '@/components/account/RefundRequestsList';
import { useState } from 'react';

export default function RefundRequestsPage() {
  // Simulate refund requests presence
  const [hasRefunds] = useState(false); // Change to true to test list

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Refund Requests</h1>
      {hasRefunds ? <RefundRequestsList /> : <RefundRequestsEmpty />}
    </div>
  );
} 