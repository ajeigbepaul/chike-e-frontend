"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { verifyPayment, updateOrderPaymentReference } from '@/services/api/order';

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
  const [paymentReference] = useState(`order-${orderId}-${Date.now()}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Debug logging
  console.log('=== PAYSTACK COMPONENT RENDERED ===');
  console.log('Public Key:', publicKey ? 'Set' : 'Missing');
  console.log('Email:', email);
  console.log('Amount (Naira):', amount);
  console.log('Amount (Kobo):', Math.round(amount * 100));
  console.log('Order ID:', orderId);
  console.log('Component rendered for order:', orderId);
  console.log('Is Client:', isClient);
  console.log('=== END PAYSTACK DEBUG ===');

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
    console.log('Payment button clicked');
    
    if (!publicKey) {
      console.error('Missing Paystack public key');
      toast.error('Payment system not configured. Please add your Paystack public key to environment variables.');
      return;
    }

    if (!email || !amount || amount <= 0) {
      console.error('Invalid payment details:', { email, amount });
      toast.error('Invalid payment details');
      return;
    }

    // First, update the order with the payment reference
    try {
      console.log('Updating order with payment reference...');
      await updateOrderPaymentReference(orderId, paymentReference);
      console.log('Order updated successfully with payment reference');
      setIsProcessing(true);
    } catch (error) {
      console.error('Failed to update order with payment reference:', error);
      toast.error('Failed to prepare payment. Please try again.');
      return;
    }

    // Use Paystack Popup directly
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      openPaystackPopup();
    } else {
      // Load Paystack script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => openPaystackPopup();
      document.head.appendChild(script);
    }
  };

  const openPaystackPopup = () => {
    console.log('Opening Paystack popup...');
    
    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: email || 'user@example.com',
      amount: Math.round(amount * 100),
      currency: 'NGN',
      ref: paymentReference,
      channels: ['card', 'bank_transfer'], // Include both payment methods
      callback: function(response: any) {
        console.log('Payment successful, response:', response);
        (async () => {
          try {
            await verifyPayment(response.reference, 'paystack');
            toast.success('Payment successful!');
            onSuccess();
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        })();
      },
      onClose: function() {
        console.log('Payment window closed');
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
