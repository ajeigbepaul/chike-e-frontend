import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';

const starCats = [
  { label: 'Communication', value: 5 },
  { label: 'Product Hygiene', value: 5 },
  { label: 'Product Quality', value: 5 },
  { label: 'Staleness', value: 5 },
  { label: 'Delivery', value: 4 },
];

export default function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState('attributes');
  const [showMore, setShowMore] = useState(false);
  const reviews = product.reviews || [];
  return (
    <div className="mt-10">
      <div className="flex gap-6 border-b border-gray-200 mb-4">
        <button
          className={`pb-2 text-lg font-medium border-b-2 transition-colors ${tab === 'attributes' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          onClick={() => setTab('attributes')}
        >
          Attributes
        </button>
        <button
          className={`pb-2 text-lg font-medium border-b-2 transition-colors ${tab === 'reviews' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          onClick={() => setTab('reviews')}
        >
          Reviews
        </button>
      </div>
      {tab === 'attributes' && (
        <div className="text-sm text-gray-900">
          <h3 className="font-bold text-lg mb-2">{product.name} – Details</h3>
          <p className="mb-4">{product.summary || product.description}</p>
          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-4">
              <div className="font-semibold mb-1">Key Features:</div>
              <ul className="list-disc pl-6">
                {product.specifications.map((spec, i) => (
                  <li key={i}>{spec.key}: {spec.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {tab === 'reviews' && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Rating summary */}
          <div className="min-w-[220px]">
            <div className="text-5xl font-bold leading-none">{product.rating || 0}</div>
            <div className="text-gray-700 font-semibold mb-2">{reviews.length} Reviews</div>
            <div className="space-y-1 mb-4">
              {starCats.map(cat => (
                <div key={cat.label} className="flex items-center gap-2 text-sm">
                  <span className="w-32 text-gray-500">{cat.label}</span>
                  <span className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < cat.value ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <input type="text" placeholder="Leave a review" className="w-full border rounded-full px-4 py-2 text-sm" />
          </div>
          {/* Right: Reviews list */}
          <div className="flex-1 space-y-8">
            {reviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet. Be the first to review this product!</div>
            ) : (
              reviews.map((r: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image src={r.user?.photo || '/avatar1.jpg'} alt={r.user?.name || 'User'} width={40} height={40} className="rounded-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{r.user?.name || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500 mb-1">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (r.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                    <div className="text-gray-700 text-sm">{r.review}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
