"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { initializePayment, verifyPayment } from '@/services/api/order';

interface PaystackPaymentProps {
  email: string | undefined;
  amount: number; // Amount in Naira
  orderId: string;
  onSuccess: () => void;
  onClose: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  email,
  amount,
  orderId,
  onSuccess,
  onClose,
  disabled = false,
  children
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render on server side
  if (!isClient) {
    return (
      <Button
        disabled
        className="w-full py-3 rounded-md font-medium bg-gray-400 text-gray-700 cursor-not-allowed"
      >
        Loading Payment...
      </Button>
    );
  }

  const handlePayment = async () => {
    if (!publicKey) {
      toast.error('Payment system not configured. Please add your Paystack public key to environment variables.');
      return;
    }

    if (!email || !amount || amount <= 0) {
      toast.error('Invalid payment details');
      return;
    }

    try {
      setIsProcessing(true);
      const initializedPayment = await initializePayment(orderId, 'paystack');
      if (!initializedPayment?.reference || !initializedPayment?.amount) {
        throw new Error('Payment could not be initialized. Please try again.');
      }
      if (typeof window !== 'undefined' && (window as any).PaystackPop) {
        openPaystackPopup(initializedPayment.reference, initializedPayment.amount);
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.onload = () =>
          openPaystackPopup(initializedPayment.reference, initializedPayment.amount);
        script.onerror = () => {
          setIsProcessing(false);
          toast.error('Unable to load payment. Please try again.');
        };
        document.head.appendChild(script);
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error(error instanceof Error ? error.message : 'Failed to prepare payment. Please try again.');
    }
  };

  const openPaystackPopup = (reference: string, serverAmount: number) => {
    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: email || 'user@example.com',
      amount: Math.round(serverAmount * 100),
      currency: 'NGN',
      ref: reference,
      channels: ['card', 'bank_transfer'], // Include both payment methods
      callback: function(response: any) {
        (async () => {
          try {
            await verifyPayment(response.reference, 'paystack');
            setIsProcessing(false);
            toast.success('Payment successful!');
            onSuccess();
          } catch {
            setIsProcessing(false);
            toast.error('Payment verification failed. Please contact support.');
          }
        })();
      },
      onClose: function() {
        setIsProcessing(false);
        onClose();
      },
      // Additional configuration to ensure proper display
      metadata: {
        order_id: orderId,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId
          }
        ]
      }
    });
    
    if (handler) {
      handler.openIframe();
    }
  };

  // Show different message if public key is missing
  if (!publicKey) {
    return (
      <Button
        disabled
        className="w-full py-3 rounded-md font-medium bg-gray-400 text-gray-700 cursor-not-allowed"
      >
        Payment System Not Configured
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className="w-full py-3 rounded-md font-medium bg-brand-yellow text-gray-900 hover:bg-yellow-400 transition-colors duration-200"
    >
      {children || `Pay ₦${amount.toLocaleString()}`}
    </Button>
  );
};
