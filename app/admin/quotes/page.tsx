"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getQuoteRequests,
  updateQuoteStatus,
  type QuoteResponse,
} from "@/services/api/quote";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminQuotesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvedPrice, setApprovedPrice] = useState<number>(0);
  const [approvedQuantity, setApprovedQuantity] = useState<number>(1);
  const queryClient = useQueryClient();

  const {
    data: quotesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quotes", currentPage],
    queryFn: () => getQuoteRequests(currentPage, 10),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ quoteId, status, message, approvedPrice, approvedQuantity }: { 
      quoteId: string; 
      status: 'responded' | 'accepted' | 'rejected'; 
      message?: string;
      approvedPrice?: number;
      approvedQuantity?: number;
    }) =>
      updateQuoteStatus(quoteId, status, message, approvedPrice, approvedQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      // Invalidate customer's specific quote query
      if (selectedQuote) {
        const customerQuoteQueryKey = ['productQuote', selectedQuote.productId, selectedQuote.customerEmail];
        console.log('Invalidating customer quote query with key:', customerQuoteQueryKey);
        queryClient.invalidateQueries({ queryKey: customerQuoteQueryKey });
      }
      setShowResponseDialog(false);
      setShowApprovalDialog(false);
      setSelectedQuote(null);
      setResponseMessage("");
      setApprovedPrice(0);
      setApprovedQuantity(1);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update quote status");
    },
  });

  const handleStatusUpdate = (
    quote: QuoteResponse, 
    status: 'responded' | 'accepted' | 'rejected'
  ) => {
    if (status === 'responded') {
      setSelectedQuote(quote);
      setShowResponseDialog(true);
    } else if (status === 'accepted') {
      setSelectedQuote(quote);
      // Set default values based on customer request
      setApprovedPrice(quote.expectedPrice || 0);
      setApprovedQuantity(quote.quantity || 1);
      setShowApprovalDialog(true);
    } else {
      updateStatusMutation.mutate({ quoteId: quote._id, status });
    }
  };

  const handleApprovalSubmit = () => {
    if (!selectedQuote || approvedPrice <= 0 || approvedQuantity <= 0) {
      toast.error('Please enter valid price and quantity');
      return;
    }
    updateStatusMutation.mutate({
      quoteId: selectedQuote._id,
      status: 'accepted',
      approvedPrice,
      approvedQuantity,
    });
  };

  const handleResponseSubmit = () => {
    if (!selectedQuote) return;
    updateStatusMutation.mutate({
      quoteId: selectedQuote._id,
      status: 'responded',
      message: responseMessage,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Quote Requests</h1>
          <div className="text-center py-8">Loading quote requests...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Quote Requests</h1>
          <div className="text-center py-8 text-red-500">
            Error loading quote requests
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Quote Requests</h1>

        {quotesData?.quotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No quote requests found
          </div>
        ) : (
          <div className="space-y-4">
            {quotesData?.quotes.map((quote) => (
              <Card key={quote._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{quote.productName}</h3>
                    <p className="text-gray-600">
                      Customer: {quote.customerName} ({quote.customerEmail})
                    </p>
                    {quote.company && (
                      <p className="text-gray-600">Company: {quote.company}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status.toUpperCase()}
                    </Badge>
                    <Badge className={getUrgencyColor(quote.urgency)}>
                      {quote.urgency.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Quantity</span>
                    <p className="font-semibold">{quote.quantity} units</p>
                  </div>
                  {quote.expectedPrice && (
                    <div>
                      <span className="text-sm text-gray-500">Expected Price</span>
                      <p className="font-semibold">
                        ₦{quote.expectedPrice.toLocaleString()} per unit
                      </p>
                    </div>
                  )}
                  {quote.customerPhone && (
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-semibold">{quote.customerPhone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Date</span>
                    <p className="font-semibold">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {quote.message && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 block mb-1">
                      Customer Message
                    </span>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {quote.message}
                    </p>
                  </div>
                )}

                {quote.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(quote, 'responded')}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={updateStatusMutation.isPending}
                    >
                      Send Response
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(quote, 'accepted')}
                      className="bg-green-500 hover:bg-green-600"
                      disabled={updateStatusMutation.isPending}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(quote, 'rejected')}
                      variant="destructive"
                      disabled={updateStatusMutation.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {quotesData && quotesData.pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {quotesData.pagination.pages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(quotesData.pagination.pages, prev + 1)
                )
              }
              disabled={currentPage === quotesData.pagination.pages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Response to Quote Request</DialogTitle>
              <DialogDescription>
                {selectedQuote && (
                  <>
                    Responding to quote request for {selectedQuote.productName} from{" "}
                    {selectedQuote.customerName}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Response Message</label>
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Enter your response to the customer..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResponseSubmit}
                  disabled={updateStatusMutation.isPending || !responseMessage.trim()}
                >
                  {updateStatusMutation.isPending ? "Sending..." : "Send Response"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Quote Request</DialogTitle>
              <DialogDescription>
                {selectedQuote && (
                  <>
                    Approving quote request for {selectedQuote.productName} from{" "}
                    {selectedQuote.customerName}. Please enter the approved price and
                    quantity.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Approved Price (₦)</label>
                <Input
                  type="number"
                  value={approvedPrice}
                  onChange={(e) => setApprovedPrice(parseFloat(e.target.value))}
                  placeholder="Enter approved price"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Approved Quantity</label>
                <Input
                  type="number"
                  value={approvedQuantity}
                  onChange={(e) => setApprovedQuantity(parseInt(e.target.value))}
                  placeholder="Enter approved quantity"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalSubmit}
                  disabled={updateStatusMutation.isPending || approvedPrice <= 0 || approvedQuantity <= 0}
                >
                  {updateStatusMutation.isPending ? "Approving..." : "Approve Quote"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
