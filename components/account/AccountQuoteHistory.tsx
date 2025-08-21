"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getQuotesForUser, patchQuoteMessage, QuoteResponse } from '@/services/api/quote';
import QuoteConversation from '@/components/QuoteConversation';
import Link from 'next/link';
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
  ImageIcon
} from 'lucide-react';

export default function AccountQuoteHistory() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(null);
  const userEmail = session?.user?.email;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userQuotes', userEmail, page],
    queryFn: () => getQuotesForUser(userEmail!, page, 10),
    enabled: !!userEmail,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ quoteId, content }: { quoteId: string; content: string }) =>
      patchQuoteMessage(quoteId, { sender: session?.user?.name || 'Customer', content }),
    onSuccess: (updatedQuote) => {
      toast.success('Message sent successfully!');
      setSelectedQuote(updatedQuote);
      queryClient.setQueryData(['userQuotes', userEmail, page], (oldData: any) => {
        if (!oldData) return oldData;
        const newQuotes = oldData.quotes.map((q: QuoteResponse) => 
          q._id === updatedQuote._id ? updatedQuote : q
        );
        return { ...oldData, quotes: newQuotes };
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to send message');
    },
  });

  const handleSendMessage = (message: string) => {
    if (selectedQuote) {
      sendMessageMutation.mutate({ quoteId: selectedQuote._id, content: message });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'responded':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow"></div>
    </div>
  );
  
  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
      <p className="font-semibold">Error loading quotes</p>
      <p>{error.message}</p>
    </div>
  );

  const quotes = data?.quotes ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Quote History Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-blue" />
            Quote History
          </h3>
        </div>
        
        <div className="space-y-3">
          {quotes.length > 0 ? (
            quotes.map(quote => (
              <div
                key={quote._id}
                className={`rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 ${
                  selectedQuote?._id === quote._id 
                    ? 'border-brand-yellow bg-[#FFF8E1] shadow-md' 
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedQuote(quote)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-brand-blue">#{quote._id.slice(-6)}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {quote.productName}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        Qty: {quote.quantity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-3">
                    {getStatusIcon(quote.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>You haven't requested any quotes yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Details Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        {selectedQuote ? (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Quote #{selectedQuote._id.slice(-6)}
                </h3>
                <p className="text-gray-500">{selectedQuote.productName}</p>
              </div>
              <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-full border ${getStatusColor(selectedQuote.status)} mt-2 sm:mt-0`}>
                {getStatusIcon(selectedQuote.status)}
                {selectedQuote.status}
              </span>
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Product Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <Link href={`/product/${selectedQuote._id}`} className="font-medium text-blue-600 hover:underline">
                      {selectedQuote.productName}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial Number:</span>
                    <span className="font-medium">{selectedQuote.productId.serialNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Message:</span>
                    <span className="font-medium text-right max-w-xs">{selectedQuote.message}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Information
                </h4>
                <div className="space-y-3">
                  {/* Expected Price & Quantity */}
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 mb-1">Your Request</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quantity:</span>
                      <span className="font-semibold">{selectedQuote.quantity} units</span>
                    </div>
                    {selectedQuote.expectedPrice && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Expected Price:</span>
                        <span className="font-semibold text-brand-blue">₦{selectedQuote.expectedPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Approved Price & Quantity - Only show if approved */}
                  {selectedQuote.approvedPrice && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 mb-1">Approved Offer</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Approved Quantity:</span>
                        <span className="font-semibold text-green-700">
                          {selectedQuote.approvedQuantity || selectedQuote.quantity} units
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Approved Price:</span>
                        <span className="font-semibold text-green-700">₦{selectedQuote.approvedPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="mb-6">
              <Link href={`/product/${selectedQuote._id}`}>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img 
                    src={selectedQuote.image || selectedQuote.productId.imageCover} 
                    alt={selectedQuote.productName} 
                    className="w-48 h-48 object-contain mx-auto rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    Click to view product details
                  </p>
                </div>
              </Link>
            </div>

            {/* Admin Response */}
            {selectedQuote.responseMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Response:
                </h4>
                <p className="text-blue-700">{selectedQuote.responseMessage}</p>
              </div>
            )}

            {/* Conversation Component */}
            <QuoteConversation quote={selectedQuote} onSend={handleSendMessage} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg">Select a quote from the list to view details</p>
            <p className="text-sm">View pricing, quantities, and continue conversations</p>
          </div>
        )}
      </div>
    </div>
  );
}