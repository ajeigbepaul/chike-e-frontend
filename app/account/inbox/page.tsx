"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '@/services/api/notification';

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

  const handleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
    if (openId !== id) {
      markAsReadMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div className="text-red-500">Failed to load messages.</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500">No messages.</div>
        ) : (
          notifications.map((msg: any) => (
            <div
              key={msg._id}
              className={`bg-white rounded-xl border p-4 cursor-pointer ${!msg.read ? 'border-yellow-400' : ''}`}
              onClick={() => handleOpen(msg._id)}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{msg.message || msg.status}</div>
                <div className="text-xs text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</div>
              </div>
              {openId === msg._id && (
                <div className="mt-2 text-gray-700 border-t pt-2 text-sm">
                  {msg.message}
                  <div className="mt-2 text-xs text-gray-400">Order: #{msg.order}</div>
                  <div className="mt-1 text-xs text-gray-400">Status: {msg.status}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 