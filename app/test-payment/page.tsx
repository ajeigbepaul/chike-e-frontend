"use client";

import { PaystackPayment } from '@/components/PaystackPayment';
import { PaystackDebug } from '@/components/PaystackDebug';

export default function TestPayment() {
  const testOrderId = 'test-order-123';
  const testAmount = 1000; // ₦1,000
  const testEmail = 'test@example.com';

  const handleSuccess = () => {
    console.log('Test payment successful!');
    alert('Test payment successful!');
  };

  const handleClose = () => {
    console.log('Test payment closed');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Paystack Payment Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Payment Details</h2>
        <p><strong>Email:</strong> {testEmail}</p>
        <p><strong>Amount:</strong> ₦{testAmount.toLocaleString()}</p>
        <p><strong>Order ID:</strong> {testOrderId}</p>
      </div>

      <div className="mb-6">
        <PaystackPayment
          email={testEmail}
          amount={testAmount}
          orderId={testOrderId}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <h3 className="font-semibold mb-2">Test Card Numbers:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Success:</strong> 4084 0840 8408 4081</li>
          <li><strong>Insufficient funds:</strong> 4094 8499 9999 9999</li>
          <li><strong>Failed:</strong> 4000 0000 0000 0408</li>
        </ul>
        <p className="mt-2"><strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date | <strong>PIN:</strong> 1234</p>
      </div>

      <PaystackDebug />
    </div>
  );
}
