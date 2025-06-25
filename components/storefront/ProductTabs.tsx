import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types/product';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useSession } from 'next-auth/react';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4">Product Description</h3>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications?.map((spec, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-gray-200"
              >
                <span className="font-medium text-gray-600">{spec.key}</span>
                <span className="text-gray-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            {user && (
              <div className="text-sm text-gray-500">
                Share your thoughts about this product
              </div>
            )}
          </div>

          {user ? (
            <ReviewForm productId={product._id} />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">
                Please{' '}
                <a href="/auth/signin" className="text-brand-yellow hover:underline">
                  log in
                </a>{' '}
                to write a review
              </p>
            </div>
          )}

          <div className="mt-8">
            <ReviewList productId={product._id} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
} 