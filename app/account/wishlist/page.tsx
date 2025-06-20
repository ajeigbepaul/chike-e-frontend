"use client"

const mockWishlist = [
  { id: 1, name: "Product A", price: "₦7,000", image: "/cat1.svg" },
  { id: 2, name: "Product B", price: "₦5,000", image: "/cat2.svg" },
];

export default function WishlistPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
      {mockWishlist.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockWishlist.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex flex-col items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
              <div className="font-semibold mb-1">{item.name}</div>
              <div className="text-brand-yellow font-bold mb-2">{item.price}</div>
              <button className="px-4 py-1 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition text-sm">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 