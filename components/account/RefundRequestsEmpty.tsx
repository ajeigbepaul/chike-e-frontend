import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function RefundRequestsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <FileText className="w-20 h-20 text-gray-400 mb-6" />
      <h2 className="text-2xl font-bold mb-2">No refund requests yet!</h2>
      <p className="text-gray-500 mb-6">{`You haven't made any refund requests. If you have an issue with an order, contact support below.`}</p>
      <Link
        href="/contact"
        className="px-6 py-2 rounded-full border border-brand-yellow text-brand-yellow font-semibold hover:bg-brand-yellow hover:text-white transition"
      >
        Contact support
      </Link>
    </div>
  );
} 