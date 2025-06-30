import type { Product } from '@/types/product';

export default function ProductAccessories({ product }: { product: Product }) {
  console.log(product)
  const accessories = [
    { name: 'Ceiling boards', active: true },
    { name: 'Nails' },
    { name: 'Wood' },
    { name: 'Door handles' },
    { name: 'Rust paint' },
  ];
  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-3">Accessories for this product</h3>
      <div className="flex flex-wrap gap-2">
        {accessories.map((a) => (
          <button
            key={a.name}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition ${a.active ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {a.name}
          </button>
        ))}
      </div>
      <a href="#" className="block mt-3 text-yellow-500 text-sm font-semibold underline">See all accessories</a>
    </div>
  );
} 