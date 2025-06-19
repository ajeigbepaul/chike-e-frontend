import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const categories = [
  'Reviews',
  'Indoor',
  'Outdoor',
  'Construction',
  'Plumbing',
  'Kitchen ware',
];

const products = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: i === 1 ? 'Square steel pipes' : 'Galvanized steel, 40kg',
  image: `/feature${(i % 4) + 1}.jpg`, // Placeholder images
  price: '₦25,000',
  unit: 'm3',
  rating: 4.8,
  reviews: '4.8k',
  isFavorite: i % 3 === 0,
}));

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top selling products</h2>
      </div>
      <div className="flex gap-6 mb-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`text-base font-medium pb-1 border-b-2 transition-colors ${
              activeCategory === cat
                ? 'border-brand-yellow text-brand-yellow'
                : 'border-transparent text-gray-700 hover:text-brand-yellow'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <hr className="border-gray-200 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product?.id} className="relative bg-white rounded-xl shadow-sm overflow-hidden group flex flex-col h-full">
          <div className="relative h-56 w-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
              <Heart fill={product.isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1 w-full">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
                <span className="font-semibold text-gray-900">{product.rating}</span>
                <span>({product.reviews} reviews)</span>
              </div>
              <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
            <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
                  <span>{product.price}/ <span className="text-xs">{product.unit}</span></span>
                  <span className="text-xs text-gray-400 ml-2 mt-1">Delivery: 7 - 9 days</span>
                </div>
          </div>
        </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition">Explore more</button>
      </div>
    </section>
  );
};

export default FeaturedProducts; 