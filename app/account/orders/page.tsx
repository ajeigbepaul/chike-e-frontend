"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import orderService from "@/services/api/order";
import Image from "next/image";
import { ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { toast } from "react-hot-toast";

const tabs = [
  { label: "All Orders", value: "all" },
  { label: "Delivered", value: "delivered" },
  { label: "In Transit", value: "in-transit" },
  { label: "Canceled", value: "canceled" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
  });

  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
  });

  const filtered =
    activeTab === "all"
      ? sortedOrders
      : sortedOrders.filter(
          (o: any) =>
            (o.status || "").replace(" ", "-").toLowerCase() === activeTab
        );

  const downloadMutation = useMutation({
    mutationFn: async (orderId: string) => {
      setDownloadingId(orderId);
      const blob = await orderService.downloadInvoice(orderId);
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to download invoice";
      toast.error(msg);
    },
    onSettled: () => {
      setDownloadingId(null);
    },
  });

//   <nav className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//   ...
// </nav>

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            My Orders
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
          Track current deliveries, see order details, and download invoices all
          in one place.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-yellow border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
            Failed to load orders. Please try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            You have no orders in this category yet.
          </div>
        ) : (
          filtered.map((order: any) => {
            const isOpen = expanded === (order._id || order.id);
            return (
              <div
                key={order._id || order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all"
              >
                <button
                  type="button"
                  className={`flex w-full flex-col gap-4 px-4 py-4 text-left transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isOpen ? "bg-brand-yellow/5" : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setExpanded(isOpen ? null : order._id || order.id)
                  }
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{order?.orderId || ""}
                        </p>
                        <span className="block text-xs font-medium text-gray-400">
                          {order?._id || order?.id}
                        </span>
                      </div>
                      <span className="inline-flex h-fit items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      <span className="hidden text-gray-300 sm:block">•</span>
                      <span>
                        {(
                          order.orderItems?.length ||
                          order.items ||
                          0
                        ).toString()}{" "}
                        item(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-base font-semibold text-gray-900 sm:text-sm">
                      ₦
                      {order.totalPrice
                        ? order.totalPrice.toLocaleString()
                        : order.total || ""}
                    </span>
                    <button
                      className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-60"
                      onClick={(e) => {
                        e.stopPropagation();
                        const id = order._id || order.id;
                        downloadMutation.mutate(id);
                      }}
                      disabled={
                        downloadMutation.isPending &&
                        downloadingId === (order._id || order.id)
                      }
                      title="Download invoice PDF"
                    >
                      <FileDown className="h-4 w-4" />
                      {downloadMutation.isPending &&
                      downloadingId === (order._id || order.id)
                        ? "Downloading..."
                        : "Invoice"}
                    </button>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-brand-yellow" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-gray-100 bg-gray-50 px-4 pt-4 pb-3 animate-fade-in">
                    {(order.orderItems || order.products || []).map(
                      (p: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          {p.product?.imageCover && (
                            <Image
                              src={p.product.imageCover}
                              alt={p.product?.name || ""}
                              width={48}
                              height={48}
                              className="rounded border object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {p.name || p.product?.name || ""}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {p.quantity || p.qty}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            ₦{(p.price || "").toLocaleString()}
                          </div>
                        </div>
                      )
                    )}
                    <div className="grid gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>
                          ₦
                          {order.itemsTotal
                            ? order.itemsTotal.toLocaleString()
                            : order.subtotal?.toLocaleString() || ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span>
                          ₦
                          {order.shippingPrice
                            ? order.shippingPrice.toLocaleString()
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>VAT</span>
                        <span>
                          ₦
                          {order.taxPrice
                            ? order.taxPrice.toLocaleString()
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-semibold text-gray-900">
                        <span>Total</span>
                        <span>
                          ₦
                          {order.totalPrice
                            ? order.totalPrice.toLocaleString()
                            : order.total || ""}
                        </span>
                      </div>
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
