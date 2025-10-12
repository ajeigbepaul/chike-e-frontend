import AccountQuoteHistory from "@/components/account/AccountQuoteHistory";

export default function QuoteHistoryPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Quote Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review submitted quotes, check pricing updates, and continue
          conversations with our team.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <AccountQuoteHistory />
      </div>
    </div>
  );
}
