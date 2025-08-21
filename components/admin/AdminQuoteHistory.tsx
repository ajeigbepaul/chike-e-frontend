"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getQuoteRequests, patchQuoteMessage, updateQuoteStatus, QuoteResponse } from '@/services/api/quote';
import QuoteConversation from '@/components/QuoteConversation';
import {
  FileText,
  User,
  Mail,
  ShoppingCart,
  Hash,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ImageIcon,
  DollarSign,
  Package,
  Filter,
  Search
} from 'lucide-react';

export default function AdminQuoteHistory() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(null);
  const [approvedPrice, setApprovedPrice] = useState<number | undefined>();
  const [approvedQuantity, setApprovedQuantity] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allQuotes', page],
    queryFn: () => getQuoteRequests(page, 10),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, responseMessage }: { status: 'accepted' | 'rejected'; responseMessage?: string }) => {
      if (!selectedQuote) throw new Error('No quote selected');
      return updateQuoteStatus(
        selectedQuote._id,
        status,
        responseMessage,
        approvedPrice,
        approvedQuantity
      );
    },
    onSuccess: () => {
      toast.success('Quote status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['allQuotes'] });
      setSelectedQuote(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update status');
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ quoteId, content }: { quoteId: string; content: string }) =>
      patchQuoteMessage(quoteId, { sender: 'admin', content }),
    onSuccess: (updatedQuote) => {
      toast.success('Message sent!');
      setSelectedQuote(updatedQuote);
      queryClient.setQueryData(['allQuotes', page], (oldData: any) => {
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

  const handleUpdateStatus = (status: 'accepted' | 'rejected') => {
    const responseMessage = status === 'accepted' 
      ? 'Your quote has been accepted.' 
      : 'Your quote has been rejected.';
    updateStatusMutation.mutate({ status, responseMessage });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'responded':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
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
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredQuotes = quotes.filter(quote => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchMatch = 
      quote.customerName.toLowerCase().includes(searchTermLower) ||
      quote.productName.toLowerCase().includes(searchTermLower) ||
      quote.customerEmail.toLowerCase().includes(searchTermLower) ||
      quote._id.toLowerCase().includes(searchTermLower);

    const statusMatch = statusFilter === 'all' || quote.status === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-screen overflow-hidden">
      {/* Quotes List Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg p-5 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-blue" />
            All Quotes
          </h3>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map(quote => (
              <div
                key={quote._id}
                className={`rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 ${
                  selectedQuote?._id === quote._id 
                    ? 'border-brand-yellow bg-[#FFF8E1] shadow-md' 
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => {
                  setSelectedQuote(quote);
                  setApprovedPrice(quote.approvedPrice);
                  setApprovedQuantity(quote.approvedQuantity || quote.quantity);
                }}
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
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {quote.customerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {quote.customerEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
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
              <p>No quotes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Details Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto">
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

            {/* Customer & Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedQuote.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedQuote.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message:</span>
                    <span className="font-medium text-right max-w-xs">{selectedQuote.message}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{selectedQuote.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial Number:</span>
                    <span className="font-medium">{selectedQuote.productId.serialNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested Quantity:</span>
                    <span className="font-medium">{selectedQuote.quantity} units</span>
                  </div>
                  {selectedQuote.expectedPrice && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Requested Price:</span>
                        <span className="font-semibold text-brand-blue">₦{selectedQuote.expectedPrice.toLocaleString()}</span>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="mb-6">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <img 
                  src={selectedQuote.image} 
                  alt={selectedQuote.productName} 
                  className="w-48 h-48 object-contain mx-auto rounded-md"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  Product Image
                </p>
              </div>
            </div>

            {/* Approved Details Section */}
            {selectedQuote.status === 'accepted' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Approved Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Price:</span>
                    <span className="font-medium">₦{selectedQuote.approvedPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Quantity:</span>
                    <span className="font-medium">{selectedQuote.approvedQuantity} units</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Update Section */}
            {(selectedQuote.status === 'pending' || selectedQuote.status === 'responded') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Update Quote Status
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Approved Price
                    </label>
                    <input
                      type="number"
                      value={approvedPrice || ''}
                      onChange={(e) => setApprovedPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Enter approved price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Approved Quantity
                    </label>
                    <input
                      type="number"
                      value={approvedQuantity || ''}
                      onChange={(e) => setApprovedQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Enter approved quantity"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus('accepted')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Quote
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Quote
                  </button>
                </div>
              </div>
            )}

            {/* Conversation Component */}
            <QuoteConversation quote={selectedQuote} onSend={handleSendMessage} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg">Select a quote to manage</p>
            <p className="text-sm">View details, update status, and communicate with customers</p>
          </div>
        )}
      </div>
    </div>
  );
}