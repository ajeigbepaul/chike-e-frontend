"use client";

import { useEffect, useState } from 'react';

export const PaystackDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkPaystack = () => {
      const info = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'Not set',
        isPaystackScriptLoaded: typeof window !== 'undefined' && !!(window as any).PaystackPop,
        reactPaystackVersion: 'Check package.json',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      };
      setDebugInfo(info);
    };

    checkPaystack();
  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded bg-gray-50 mt-4">
      <h3 className="font-bold mb-2">Paystack Debug Info</h3>
      <pre className="text-xs">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
