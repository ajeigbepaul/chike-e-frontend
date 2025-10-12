"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/api/notification";
import { ChevronDown, ChevronUp } from "lucide-react";

const tabs = [
  { label: "All", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "In Transit", value: "in-transit" },
  { label: "Canceled", value: "canceled" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

export default function InboxPage() {
  const queryClient = useQueryClient();
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  });
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
    if (openId !== id) {
      markAsReadMutation.mutate(id);
    }
  };

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter(
          (n: any) =>
            (n.status || "").replace(" ", "-").toLowerCase() === activeTab
        );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Inbox
          </h1>
          <div className="flex w-full gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-full border border-gray-200 bg-gray-50 p-1 text-sm shadow-inner sm:w-auto sm:gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 font-medium transition-colors sm:flex-none ${
                  activeTab === tab.value
                    ? "bg-brand-yellow text-gray-900"
                    : "text-gray-600 hover:text-brand-yellow"
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          View order updates and messages from our support team. Tap a message
          to see details.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
            Failed to load messages. Please try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-gray-500">
            You have no messages yet.
          </div>
        ) : (
          filtered.map((msg: any) => {
            const isOpen = openId === msg._id;
            const status = msg.status || "Pending";
            return (
              <div
                key={msg._id}
                className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all ${
                  isOpen ? "bg-brand-yellow/10" : "hover:bg-gray-50"
                } ${!msg.read ? "border-yellow-400" : ""}`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  onClick={() => handleOpen(msg._id)}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <p className="text-sm font-semibold text-gray-900">
                        Order #{msg.order}
                      </p>
                      <span className="inline-flex h-fit items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        {status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.read && (
                      <span className="h-2 w-2 rounded-full bg-brand-yellow" />
                    )}
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand-yellow" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-gray-100 bg-gray-50 px-4 pt-4 pb-3 text-sm text-gray-700 animate-fade-in">
                    <p>{msg.message}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>Order: #{msg.order}</span>
                      <span className="hidden text-gray-300 sm:block">•</span>
                      <span>Status: {status}</span>
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
