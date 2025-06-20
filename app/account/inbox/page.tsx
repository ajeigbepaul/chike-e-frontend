"use client"
import { useState } from "react";

const mockMessages = [
  { id: 1, subject: "Order Shipped", date: "2024-05-10", content: "Your order #123456 has been shipped!" },
  { id: 2, subject: "Promo: 10% Off!", date: "2024-05-08", content: "Enjoy 10% off your next purchase. Use code JUMIA10." },
];

export default function InboxPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>
      <div className="space-y-4">
        {mockMessages.length === 0 ? (
          <div className="text-gray-500">No messages.</div>
        ) : (
          mockMessages.map(msg => (
            <div key={msg.id} className="bg-white rounded-xl border p-4 cursor-pointer" onClick={() => setOpenId(openId === msg.id ? null : msg.id)}>
              <div className="flex justify-between items-center">
                <div className="font-semibold">{msg.subject}</div>
                <div className="text-xs text-gray-500">{msg.date}</div>
              </div>
              {openId === msg.id && (
                <div className="mt-2 text-gray-700 border-t pt-2 text-sm">{msg.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 