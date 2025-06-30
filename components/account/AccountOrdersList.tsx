"use client"
import Image from 'next/image';
import React, { useState } from 'react';

const mockOrders = [
  {
    id: '481293',
    status: 'DELIVERED',
    total: '₦4,800,000',
    items: 7,
    products: [
      {
        id: 1,
        name: 'Roofing sheet',
        color: 'Brown',
        size: 'Small(S)',
        price: '₦25,000',
        qty: 2,
        image: '/cat1.svg',
        shippedFrom: 'Argentina',
        date: 'Jan 7, 2025',
      },
      // ...repeat as needed
    ],
  },
  // ...more orders
];

export default function AccountOrdersList() {
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);
  return (
    <div className="flex gap-6">
      {/* Order History */}
      <div className="w-64 bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Order History</h3>
          <select className="border rounded px-2 py-1 text-sm">
            <option>This week</option>
            <option>This month</option>
          </select>
        </div>
        <div className="space-y-2">
          {mockOrders.map(order => (
            <div
              key={order.id}
              className={`rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between ${
                selectedOrder.id === order.id ? 'bg-[#FFF8E1] border-l-4 border-brand-yellow' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div>
                <div className="font-semibold">#{order.id}</div>
                <div className="text-xs text-gray-500">{order.total}</div>
                <div className="text-xs text-gray-400">{order.items} items</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                order.status === 'IN TRANSIT' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'CANCELED' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Order Details */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Order #{selectedOrder.id} <span className="text-base text-gray-400 ml-2">({selectedOrder.products.length})</span></h3>
          <span className="text-xs font-bold px-3 py-1 rounded bg-green-100 text-green-700">{selectedOrder.status}</span>
        </div>
        <div className="space-y-4">
          {selectedOrder.products.map((product, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
              <Image width={24} height={24} src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-semibold text-lg">{product.name}</div>
                <div className="text-sm text-gray-500">Color – {product.color} • Size – {product.size}</div>
                <div className="text-xs text-gray-400">Shipped from: {product.shippedFrom}</div>
                <div className="text-xs text-gray-400">{product.date}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{product.price}</div>
                <div className="text-xs text-gray-400">{product.qty} pieces</div>
                <div className="text-xs text-gray-400">Vat included</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 