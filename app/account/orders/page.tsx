"use client"
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/api/order';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

const tabs = [
  { label: "All Orders", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "In Transit", value: "in-transit" },
  { label: "Canceled", value: "canceled" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMyOrders,
  });

  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
  });

  const filtered = activeTab === "all"
    ? sortedOrders
    : sortedOrders.filter((o: any) => (o.status || '').replace(" ", "-").toLowerCase() === activeTab);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="flex gap-6 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${activeTab === tab.value ? "border-brand-yellow text-brand-yellow" : "border-transparent text-gray-700 hover:text-brand-yellow"}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div className="text-red-500">Failed to load orders.</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500">No orders found.</div>
        ) : (
          filtered.map((order: any) => {
            const isOpen = expanded === (order._id || order.id);
            return (
              <div key={order._id || order.id} className="bg-white rounded-xl border p-0 overflow-hidden shadow-sm transition-all">
                <div
                  className={`flex justify-between items-center cursor-pointer px-4 py-4 transition-colors ${isOpen ? 'bg-brand-yellow/10' : 'hover:bg-gray-50'}`}
                  onClick={() => setExpanded(isOpen ? null : (order._id || order.id))}
                >
                  <div>
                    <div className="font-semibold text-lg flex items-center gap-2">
                      Order #{order._id || order.id}
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-normal">{order.status || 'PENDING'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''} • {order.orderItems ? order.orderItems.length : order.items || 0} item(s)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">₦{order.totalPrice ? order.totalPrice.toLocaleString() : order.total || ''}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-brand-yellow" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="bg-gray-50 border-t pt-4 pb-2 px-4 space-y-3 animate-fade-in">
                    {(order.orderItems || order.products || []).map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 border-b last:border-b-0 pb-3 last:pb-0">
                        {p.product?.imageCover && (
                          <Image src={p.product.imageCover} alt={p.product?.name || ''} width={48} height={48} className="rounded object-cover border" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{p.name || p.product?.name || ''}</div>
                          <div className="text-xs text-gray-500">Qty: {p.quantity || p.qty}</div>
                        </div>
                        <div className="font-semibold text-gray-700">₦{(p.price || '').toLocaleString()}</div>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4 text-base">
                      <span>Total</span>
                      <span>₦{order.totalPrice ? order.totalPrice.toLocaleString() : order.total || ''}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 