"use client"
import { useState } from "react";

const tabs = [
  { label: "All Orders", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "In Transit", value: "in-transit" },
  { label: "Canceled", value: "canceled" },
];

const mockOrders = [
  {
    id: "123456",
    status: "DELIVERED",
    total: "₦12,000",
    date: "2024-05-01",
    items: 2,
    products: [
      { name: "Product A", qty: 1, price: "₦7,000" },
      { name: "Product B", qty: 1, price: "₦5,000" },
    ],
  },
  {
    id: "789012",
    status: "IN TRANSIT",
    total: "₦8,500",
    date: "2024-05-10",
    items: 1,
    products: [
      { name: "Product C", qty: 1, price: "₦8,500" },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = activeTab === "all" ? mockOrders : mockOrders.filter(o => o.status.replace(" ", "-").toLowerCase() === activeTab);

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
        {filtered.length === 0 ? (
          <div className="text-gray-500">No orders found.</div>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <div className="font-semibold">Order #{order.id}</div>
                  <div className="text-xs text-gray-500">{order.date} • {order.items} item(s)</div>
                </div>
                <div className="text-sm font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">{order.status}</div>
              </div>
              {expanded === order.id && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{p.name} x{p.qty}</span>
                      <span>{p.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>{order.total}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 