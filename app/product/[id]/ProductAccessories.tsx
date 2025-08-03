import type { Product } from '@/types/product';
import ProductCard from '@/components/storefront/ProductCard';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProductAccessories({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;

  // Show message if no accessories
  if (!product.accessories || product.accessories.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-3">Accessories for this product</h3>
        <p className="text-gray-500">No accessories available for this product.</p>
      </div>
    );
  }

  const currentAccessory = product.accessories[activeTab];

  const productsData = currentAccessory?.products || [];

  const handleAddToCart = (productData: Product) => {
    dispatch(addToCart({
      id: productData._id,
      name: productData.name,
      price: productData.price,
      quantity: 1,
      image: productData.imageCover
    }));
    toast.success('Added to cart');
  };

  const handleRequireLogin = () => {
    router.push('/auth/signin');
  };

  const renderProducts = () => {
    if (productsData.length === 0) {
      return <p className="text-gray-500">No products available for this accessory.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productsData.map(productData => (
          <ProductCard
            key={productData._id}
            id={productData._id}
            title={productData.name}
            image={productData.imageCover}
            price={productData.price.toLocaleString()}
            unit={productData.priceUnit}
            rating={productData.rating || 0}
            reviews={productData.reviews ? productData.reviews.length.toString() : '0'}
            isFavorite={false} // You can implement wishlist logic here
            onFavoriteToggle={() => {}} // Implement wishlist toggle
            onAddToCart={() => handleAddToCart(productData)}
            isLoggedIn={isLoggedIn}
            onRequireLogin={()=>{}}
            quantity={productData.quantity || 0}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-3">Accessories for this product</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {product.accessories.map((accessory, index) => (
          <button
            key={accessory._id}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
              activeTab === index 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {accessory.name}
          </button>
        ))}
      </div>
      {renderProducts()}
      <a href="#" className="block mt-3 text-yellow-500 text-sm font-semibold underline">
        See all accessories
      </a>
    </div>
  );
}
