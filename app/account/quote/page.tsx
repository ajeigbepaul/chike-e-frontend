import AccountQuoteHistory from '@/components/account/AccountQuoteHistory';

export default function QuoteHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Quotes</h1>
      <AccountQuoteHistory />
    </div>
  );
}