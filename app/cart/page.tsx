"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  // const [note, setNote] = useState('');
  // const [coupon, setCoupon] = useState('');
  const router = useRouter();

  // Example static values
//   const doorDelivery = 20000;
  const vat = 5000;

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = itemsTotal + vat;

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-10 flex flex-col md:flex-row gap-8">
      {/* Cart Items List */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Your cart ({cart.length} Item{cart.length !== 1 ? 's' : ''})</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg border p-4 relative">
                {/* Checkbox (optional) */}
                <input type="checkbox" className="mr-2" />
                {/* Product Image */}
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                </div>
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 flex items-center gap-1 text-sm font-semibold">
                      <Star className="w-4 h-4" fill="#F7B50E" /> 4.8 <span className="text-gray-400">(4.3k reviews)</span>
                    </span>
                  </div>
                  <div className="font-bold text-lg truncate mb-1">{item.name}</div>
                  <div className="text-gray-700 font-semibold mb-1">₦{item.price.toLocaleString()}/ m3 <span className="text-xs text-gray-400 ml-2">Delivery: 7 - 9 days</span></div>
                </div>
                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    disabled={item.quantity <= 1}
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => {
                      const val = Math.max(1, Number(e.target.value));
                      dispatch(updateQuantity({ id: item.id, quantity: val }));
                    }}
                    className="text-center border rounded px-2 py-2 w-10"
                  />
                  <button
                    className="px-2 py-1 rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  >
                    +
                  </button>
                </div>
                {/* Remove Button */}
                <button
                  className="ml-4 text-red-500 hover:bg-red-50 rounded-full p-2 transition absolute top-1 right-2"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  title="Remove"
                > <Image src="/delete.svg" alt="Delete" width={30} height={30} />
                  {/* <Trash2 className="w-5 h-5" /> */}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Cart Details */}
      <div className="w-full md:w-[350px] bg-white rounded-xl shadow p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold mb-4">Cart Details</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Items ({cart.length})</span>
            <span>₦{itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          {/* <div className="flex justify-between mb-2 text-gray-700">
            <span>Door delivery</span>
            <span>₦{doorDelivery.toLocaleString()}</span>
          </div> */}
          <div className="flex justify-between mb-2 text-gray-700">
            <span>VAT</span>
            <span>₦{vat.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>SubTotal</span>
            <span className="text-brand-yellow">₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        {/* <div>
          <label className="block text-sm font-semibold mb-1">Notes (Optional)</label>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={2}
            placeholder="Write a note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div> */}
        {/* <div>
          <input
            type="text"
            className="w-full border rounded p-2 mb-2"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
          <button className="w-full border border-yellow-400 text-yellow-600 py-2 rounded font-semibold hover:bg-yellow-50 mb-2">APPLY COUPON</button>
        </div> */}
        <button onClick={()=>router.push("/checkout")} className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold text-lg hover:bg-brand-yellow hover:text-gray-900 transition">
          Checkout ₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </button>
      </div>
    </div>
  );
} 