import Link from "next/link";
import { FileText } from "lucide-react";

export default function RefundRequestsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gray-50 py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
        <FileText className="h-8 w-8 text-gray-400" />
      </span>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          No refund requests yet
        </h2>
        <p className="max-w-md text-sm text-gray-500">
          {`You haven't made any refund requests. If there's an issue with an order, reach out to our support team below.`}
        </p>
      </div>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-full border border-brand-yellow px-6 py-2 text-sm font-semibold text-brand-yellow transition hover:bg-brand-yellow hover:text-gray-900"
      >
        Contact support
      </Link>
    </div>
  );
}
