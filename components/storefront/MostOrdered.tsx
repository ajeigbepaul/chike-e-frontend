import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const products = [
  // 4 small products (left column)
  {
    id: 1,
    image: '/hero.jpg',
    title: 'Galvanized steel, 40kg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: true,
  },
  {
    id: 2,
    image: '/hero.jpg',
    title: 'Galvanized steel, 40kg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: false,
  },
  {
    id: 3,
    image: '/hero.jpg',
    title: 'Galvanized steel, 40kg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: false,
  },
  {
    id: 4,
    image: '/hero.jpg',
    title: 'Galvanized steel, 40kg',
    price: '₦25,000',
    unit: 'm3',
    rating: 4.8,
    reviews: '4.3k',
    isFavorite: true,
  },
];

const largeProduct = {
  id: 5,
  image: '/hero.jpg',
  title: 'Galvanized steel, 40kg',
  price: '₦25,000',
  unit: 'm3',
  rating: 4.8,
  reviews: '4.3k',
  isFavorite: true,
};

const MostOrderedProducts = () => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <span className="inline-block bg-[#F7B50E1A] text-brand-yellow px-4 py-1 rounded-full text-sm font-medium mb-2">
          -20% OFF all products
        </span>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Enjoy some of our most<br />ordered products
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl">
          Volutpat commodo sed egestas egestas fringilla phasellus. Tincidunt eget nullam non nisi. Nisi porta lorem mollis aliquam ut porttitor leo.
        </p>
      </div>
      <button className="self-start md:self-center px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-brand-yellow hover:text-gray-900 transition text-lg">
        Shop now
      </button>
    </div>
    {/* Gallery */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: 4 small products in 2x2 grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
        {products.map((product) => (
          <div key={product.id} className="relative bg-white rounded-xl overflow-hidden group flex flex-col">
            <div className="relative w-full h-40 md:h-44 rounded-xl overflow-hidden">
              <Image src={product.image} alt={product.title} fill className="object-cover w-full h-full" />
              <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
                <Heart fill={product.isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 w-full">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span>({product.reviews} reviews)</span>
                </div>
                <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-8 h-8">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <span>{product.price}/ <span className="text-xs">{product.unit}</span></span>
                <span className="text-xs text-gray-400 ml-2">Delivery: 7 - 9 days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Right: 1 large product */}
      <div className="relative bg-white rounded-xl overflow-hidden group flex flex-col">
        <div className="relative w-full h-80 md:h-full rounded-xl overflow-hidden">
          <Image src={largeProduct.image} alt={largeProduct.title} fill className="object-cover w-full h-full" />
          <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
            <Heart fill={largeProduct.isFavorite ? '#F7B50E' : 'none'} className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 w-full">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400" fill="#F7B50E" />
              <span className="font-semibold text-gray-900">{largeProduct.rating}</span>
              <span>({largeProduct.reviews} reviews)</span>
            </div>
            <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{largeProduct.title}</h3>
          <div className="flex items-center text-base text-gray-700 font-medium">
            <span>{largeProduct.price}/ <span className="text-xs">{largeProduct.unit}</span></span>
            <span className="text-xs text-gray-400 ml-2">Delivery: 7 - 9 days</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MostOrderedProducts;