// frontend/components/account/AccountOrdersEmpty.tsx
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function AccountOrdersEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <FileText className="w-20 h-20 text-gray-400 mb-6" />
      <h2 className="text-2xl font-bold mb-2">No orders yet!</h2>
      <p className="text-gray-500 mb-6">{`You haven't made an order yet. Explore products below`}</p>
      <Link
        href="/products"
        className="px-6 py-2 rounded-full border border-brand-yellow text-brand-yellow font-semibold hover:bg-brand-yellow hover:text-white transition"
      >
        Explore products
      </Link>
    </div>
  );
}