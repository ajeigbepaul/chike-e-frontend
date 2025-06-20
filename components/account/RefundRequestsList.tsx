import Link from 'next/link';

const mockRefunds = [
  {
    id: 'R12345',
    orderId: '481293',
    date: 'Jan 10, 2025',
    status: 'Pending',
    reason: 'Wrong item delivered',
  },
  {
    id: 'R12346',
    orderId: '481294',
    date: 'Jan 8, 2025',
    status: 'Approved',
    reason: 'Damaged product',
  },
];

export default function RefundRequestsList() {
  return (
    <div className="space-y-4">
      {mockRefunds.map(refund => (
        <div key={refund.id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="font-bold text-lg mb-1">Refund #{refund.id}</div>
            <div className="text-sm text-gray-500 mb-1">Order #{refund.orderId} • {refund.date}</div>
            <div className="text-sm text-gray-700 mb-1">Reason: {refund.reason}</div>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded ${
              refund.status === 'Approved' ? 'bg-green-100 text-green-700' :
              refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              refund.status === 'Rejected' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {refund.status}
            </span>
          </div>
          <div>
            <Link href={`/account/refunds/${refund.id}`} className="text-brand-yellow font-semibold hover:underline">View details</Link>
          </div>
        </div>
      ))}
    </div>
  );
} 