"use client"

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import reviewService, { Review } from '@/services/api/review';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import orderService from '@/services/api/order';

export default function UserReviews() {
  const { toast } = useToast();
  const { data: reviewsResponse, refetch } = useQuery({
    queryKey: ['user-reviews'],
    queryFn: () => reviewService.getUserReviews(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMyOrders,
  });

  const reviews: Review[] = reviewsResponse?.data || [];
  const reviewedProductIds = new Set(reviews.map(r => r.product));
  const deliveredOrders = orders.filter((o: any) => (o.status || '').toLowerCase() === 'delivered');
  const productsToReview = deliveredOrders.flatMap((order: any) =>
    (order.orderItems || []).filter((item: any) => !reviewedProductIds.has(item.product))
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const openReviewModal = (product: any) => {
    setReviewProduct(product);
    setRating(0);
    setText('');
    setModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewProduct || !rating || !text.trim()) return;
    try {
      await reviewService.createReview({
        product: reviewProduct.product,
        rating,
        review: text,
      });
      toast({ title: 'Success', description: 'Review submitted!' });
      setModalOpen(false);
      refetch();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to submit review', variant: 'destructive' });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await reviewService.deleteReview(reviewId);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
        <p className="text-gray-600 mb-6">You haven&apos;t written any reviews yet.</p>
        <Link
          href="/products"
          className="text-brand-yellow hover:underline"
        >
          Browse products to review
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-8">My Reviews</h2>
      {/* Products to review */}
      {productsToReview.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Pending Reviews</h3>
          <div className="space-y-4">
            {productsToReview.map((item: any) => (
              <div key={item.product} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div>
                  <div className="font-medium">{item.name || item.product?.name || 'Product'}</div>
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
                <Button onClick={() => openReviewModal(item)}>Write Review</Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Existing reviews */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">You haven&apos;t written any reviews yet.</p>
            <Link href="/products" className="text-brand-yellow hover:underline">Browse products to review</Link>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/products/${review.product}`} className="text-lg font-medium hover:text-brand-yellow">View Product</Link>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(review._id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <p className="mt-4 text-gray-600">{review.review}</p>
            </div>
          ))
        )}
      </div>
      {/* Write Review Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="font-medium mb-2">{reviewProduct?.name || reviewProduct?.product?.name || 'Product'}</div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} onClick={() => setRating(star)} />
              ))}
            </div>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Write your review..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitReview} disabled={!rating || !text.trim()}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 