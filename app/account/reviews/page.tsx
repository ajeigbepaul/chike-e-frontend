"use client"

const mockPendingReviews = [
  { id: 1, name: "Product A", date: "2024-05-01", image: "/cat1.svg" },
  { id: 2, name: "Product B", date: "2024-05-10", image: "/cat2.svg" },
];

export default function PendingReviewsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>
      <div className="space-y-4">
        {mockPendingReviews.length === 0 ? (
          <div className="text-gray-500">No pending reviews.</div>
        ) : (
          mockPendingReviews.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">Purchased on {item.date}</div>
              </div>
              <button className="px-4 py-2 rounded-full bg-brand-yellow text-white font-semibold hover:bg-yellow-500 transition">Leave a Review</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 