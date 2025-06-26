"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '@/services/api/notification';
import { ChevronDown, ChevronUp } from 'lucide-react';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'In Transit', value: 'in-transit' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

export default function InboxPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
    if (openId !== id) {
      markAsReadMutation.mutate(id);
    }
  };

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter((n: any) => (n.status || '').replace(' ', '-').toLowerCase() === activeTab);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>
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
          <div className="text-red-500">Failed to load messages.</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500">No messages.</div>
        ) : (
          filtered.map((msg: any) => {
            const isOpen = openId === msg._id;
            return (
              <div
                key={msg._id}
                className={`bg-white rounded-xl border p-0 overflow-hidden shadow-sm transition-all ${isOpen ? 'bg-brand-yellow/10' : 'hover:bg-gray-50'} ${!msg.read ? 'border-yellow-400' : ''}`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer px-4 py-4 transition-colors"
                  onClick={() => handleOpen(msg._id)}
                >
                  <div>
                    <div className="font-semibold text-lg flex items-center gap-2">
                      <span>Order #{msg.order}</span>
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-normal">{msg.status || 'PENDING'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-brand-yellow" />}
                    {isOpen ? <ChevronUp className="w-5 h-5 text-brand-yellow" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="bg-gray-50 border-t pt-4 pb-2 px-4 space-y-2 animate-fade-in">
                    <div className="text-gray-700 text-sm">{msg.message}</div>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <div>Order: #{msg.order}</div>
                      <div>Status: {msg.status}</div>
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