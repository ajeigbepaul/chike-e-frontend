"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getQuotesForUser,
  patchQuoteMessage,
  QuoteResponse,
} from "@/services/api/quote";
import QuoteConversation from "@/components/QuoteConversation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Calendar,
  ShoppingCart,
  DollarSign,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function AccountQuoteHistory() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(
    null
  );
  const userEmail = session?.user?.email;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userQuotes", userEmail, page],
    queryFn: () => getQuotesForUser(userEmail!, page, 10),
    enabled: !!userEmail,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ quoteId, content }: { quoteId: string; content: string }) =>
      patchQuoteMessage(quoteId, {
        sender: session?.user?.name || "Customer",
        content,
      }),
    onSuccess: (updatedQuote) => {
      toast.success("Message sent successfully!");
      setSelectedQuote(updatedQuote);
      queryClient.setQueryData(
        ["userQuotes", userEmail, page],
        (oldData: any) => {
          if (!oldData) return oldData;
          const newQuotes = oldData.quotes.map((q: QuoteResponse) =>
            q._id === updatedQuote._id ? updatedQuote : q
          );
          return { ...oldData, quotes: newQuotes };
        }
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  const handleSendMessage = (message: string) => {
    if (selectedQuote) {
      sendMessageMutation.mutate({
        quoteId: selectedQuote._id,
        content: message,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "responded":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "responded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading quotes</p>
        <p>{error.message}</p>
      </div>
    );

  const quotes = data?.quotes ?? [];
  const pagination = data?.pagination;

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-brand-yellow" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      {/* Quote History Sidebar */}
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:w-80">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-brand-blue" />
              Quote History
            </h3>
          </div>

          <div className="space-y-3">
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <button
                  key={quote._id}
                  onClick={() => setSelectedQuote(quote)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-shadow",
                    selectedQuote?._id === quote._id
                      ? "border-brand-yellow bg-[#FFF8E1] shadow-md"
                      : "border-gray-100 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="text-brand-blue">
                          #{quote._id.slice(-6)}
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5",
                            getStatusColor(quote.status)
                          )}
                        >
                          {quote.status}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {quote.productName}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4" />
                          Qty: {quote.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-400">
                      {getStatusIcon(quote.status)}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center text-gray-500">
                <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm">
                  You haven&apos;t requested any quotes yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quote Details Panel */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {selectedQuote ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Quote #{selectedQuote._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedQuote.productName}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
                    getStatusColor(selectedQuote.status)
                  )}
                >
                  {getStatusIcon(selectedQuote.status)}
                  {selectedQuote.status}
                </span>
              </div>

              {/* Product Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    <ShoppingCart className="h-5 w-5" />
                    Product Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Product:</span>
                      <Link
                        href={`/product/${selectedQuote._id}`}
                        className="truncate text-right text-sm font-medium text-brand-blue hover:underline"
                      >
                        {selectedQuote.productName}
                      </Link>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-gray-600">Your Message:</span>
                      <span className="max-w-[14rem] text-right text-sm font-medium text-gray-800">
                        {selectedQuote.message}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    <DollarSign className="h-5 w-5" />
                    Pricing Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="text-xs uppercase tracking-wide text-gray-400">
                        Your Request
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedQuote.quantity} units
                        </span>
                      </div>
                      {selectedQuote.expectedPrice && (
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-gray-600">Expected Price:</span>
                          <span className="font-semibold text-brand-blue">
                            ₦{selectedQuote.expectedPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {selectedQuote.approvedPrice && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                        <div className="text-xs uppercase tracking-wide text-green-600">
                          Approved Offer
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-gray-600">
                            Approved Quantity:
                          </span>
                          <span className="font-semibold text-green-700">
                            {selectedQuote.approvedQuantity ||
                              selectedQuote.quantity}{" "}
                            units
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-gray-600">Approved Price:</span>
                          <span className="font-semibold text-green-700">
                            ₦{selectedQuote.approvedPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                <Link href={`/product/${selectedQuote._id}`}>
                  <div className="flex flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:justify-between">
                    <img
                      src={
                        selectedQuote.image ||
                        selectedQuote.productId.imageCover
                      }
                      alt={selectedQuote.productName}
                      className="h-40 w-40 rounded-lg object-contain"
                    />
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <ImageIcon className="h-4 w-4" />
                      Tap to view product details
                    </p>
                  </div>
                </Link>
              </div>

              {/* Admin Response */}
              {selectedQuote.responseMessage && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-blue-900">
                    <MessageSquare className="h-5 w-5" />
                    Admin Response
                  </h4>
                  <p className="mt-2 text-sm text-blue-800">
                    {selectedQuote.responseMessage}
                  </p>
                </div>
              )}

              {/* Conversation Component */}
              <QuoteConversation
                quote={selectedQuote}
                onSend={handleSendMessage}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-500">
              <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg font-semibold">
                Select a quote to view details
              </p>
              <p className="text-sm">
                Compare offers, review pricing, and continue the conversation
                with our team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.total > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {pagination.total}
          </span>
          <button
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, pagination.total))
            }
            disabled={page === pagination.total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
