import AdminQuoteHistory from '@/components/admin/AdminQuoteHistory';

export default function AdminQuoteHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quote Requests History</h1>
      <AdminQuoteHistory />
    </div>
  );
}
