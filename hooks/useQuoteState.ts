"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  getProductQuoteForCustomer, 
  submitQuoteRequest, 
  type QuoteResponse,
  type QuoteRequest 
} from '@/services/api/quote';

export type QuoteButtonState = 
  | 'request' // Initial state - "Request Quote"
  | 'pending' // Quote submitted, waiting for admin response - "Pending Request"
  | 'approved' // Quote approved by admin - "Quote Approved - Make Payment"
  | 'rejected'; // Quote rejected - back to "Request Quote"

export interface UseQuoteStateReturn {
  buttonState: QuoteButtonState;
  buttonText: string;
  buttonColor: string;
  isDisabled: boolean;
  quote: QuoteResponse | null;
  isLoading: boolean;
  submitQuote: (quoteData: Omit<QuoteRequest, 'productId' | 'productName' | 'customerName' | 'customerEmail' | 'image'>, image: string) => Promise<void>;
  handlePayment: () => void;
  refetch: () => Promise<any>;
}

export const useQuoteState = (productId: string, productName: string): UseQuoteStateReturn => {
  const { data: session } = useSession();
  const router = useRouter()
  const queryClient = useQueryClient();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  // Fetch existing quote for this product and customer
  const { data: existingQuote, isLoading, refetch } = useQuery({
    queryKey: ['productQuote', productId, session?.user?.email],
    queryFn: () => {
      if (!session?.user?.email) return null;
      return getProductQuoteForCustomer(productId, session.user.email);
    },
    enabled: !!session?.user?.email,
    retry: false,
  });

  // Update local quote state when data changes
  useEffect(() => {
    setQuote(existingQuote || null);
  }, [existingQuote]);

  // Mutation for submitting new quote
  const quoteMutation = useMutation({
    mutationFn: (data: Omit<QuoteRequest, 'productId' | 'productName' | 'customerName' | 'customerEmail'> & { image?: string }) => {
      if (!session?.user?.email || !session?.user?.name) {
        throw new Error('User not authenticated');
      }

      const quoteRequest: QuoteRequest = {
        productId,
        productName,
        customerEmail: session.user.email,
        customerName: session.user.name,
        ...data,
      };

      return submitQuoteRequest(quoteRequest);
    },
    onSuccess: (newQuote) => {
      toast.success("Quote request submitted successfully! We'll get back to you soon.");
      setQuote(newQuote);
      queryClient.invalidateQueries({ queryKey: ['productQuote'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit quote request');
    },
  });

  // Determine button state based on quote status
  const getButtonState = (): QuoteButtonState => {
    if (!quote) return 'request';
    
    switch (quote.status) {
      case 'pending':
        return 'pending';
      case 'accepted':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return 'request';
    }
  };

  const buttonState = getButtonState();

  // Get button properties based on state
  const getButtonProperties = (state: QuoteButtonState) => {
    switch (state) {
      case 'request':
        return {
          text: 'Request Quote',
          color: 'border-yellow-400 text-yellow-600 hover:bg-yellow-50',
          disabled: false,
        };
      case 'pending':
        return {
          text: 'Pending Request',
          color: 'border-gray-400 text-gray-600 bg-gray-50',
          disabled: true,
        };
      case 'approved':
        return {
          text: 'Quote Approved - Make Payment',
          color: 'border-green-500 text-white bg-green-500 hover:bg-green-600',
          disabled: false,
        };
      case 'rejected':
        return {
          text: 'Request Quote',
          color: 'border-yellow-400 text-yellow-600 hover:bg-yellow-50',
          disabled: false,
        };
      default:
        return {
          text: 'Request Quote',
          color: 'border-yellow-400 text-yellow-600 hover:bg-yellow-50',
          disabled: false,
        };
    }
  };

  const { text: buttonText, color: buttonColor, disabled: isDisabled } = getButtonProperties(buttonState);

  const submitQuote = async (quoteData: Omit<QuoteRequest, 'productId' | 'productName' | 'customerName' | 'customerEmail' | 'image'>, image: string) => {
    await quoteMutation.mutateAsync({ ...quoteData, image });
  };

  const handlePayment = useCallback(() => {
    console.log('handlePayment called');
    console.log('Current quote:', quote);

    if (quote && quote.status === 'accepted' && quote.approvedPrice && quote.approvedQuantity) {
      console.log('Quote data is complete. Proceeding to checkout.');
      const checkoutData = {
        productId,
        productName,
        price: quote.approvedPrice,
        quantity: quote.approvedQuantity,
        quoteId: quote._id,
        image: quote.image,
      };

      console.log('Checkout data:', checkoutData);
      sessionStorage.setItem('approvedQuote', JSON.stringify(checkoutData));
      console.log('Stored in sessionStorage. Redirecting...');
      router.push('/checkout')
      // window.location.href = '/checkout';
      console.log('Redirect initiated. This log might not appear if navigation is immediate.');
    } else {
      console.log('Quote data is incomplete. Showing error toast.');
      toast.error('Quote approval data is incomplete');
    }
  }, [quote, productId, productName]);

  return {
    buttonState,
    buttonText,
    buttonColor,
    isDisabled: isDisabled || quoteMutation.isPending,
    quote,
    isLoading: isLoading || quoteMutation.isPending,
    submitQuote,
    handlePayment,
    refetch,
  };
};
