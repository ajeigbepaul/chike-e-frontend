import Link from "next/link";

const mockRefunds = [
  {
    id: "R12345",
    orderId: "481293",
    date: "Jan 10, 2025",
    status: "Pending",
    reason: "Wrong item delivered",
  },
  {
    id: "R12346",
    orderId: "481294",
    date: "Jan 8, 2025",
    status: "Approved",
    reason: "Damaged product",
  },
];

export default function RefundRequestsList() {
  return (
    <div className="space-y-4">
      {mockRefunds.map((refund) => (
        <div
          key={refund.id}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-2">
            <div className="text-lg font-semibold text-gray-900">
              Refund #{refund.id}
            </div>
            <div className="text-sm text-gray-500">
              Order #{refund.orderId} • {refund.date}
            </div>
            <div className="text-sm text-gray-600">Reason: {refund.reason}</div>
            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                refund.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : refund.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : refund.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {refund.status}
            </span>
          </div>
          <Link
            href={`/account/refunds/${refund.id}`}
            className="inline-flex items-center justify-center rounded-full border border-brand-yellow px-4 py-2 text-sm font-semibold text-brand-yellow transition hover:bg-brand-yellow hover:text-gray-900"
          >
            View details
          </Link>
        </div>
      ))}
    </div>
  );
}
