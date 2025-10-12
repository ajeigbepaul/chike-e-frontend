"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import reviewService, { Review } from "@/services/api/review";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import orderService from "@/services/api/order";

export default function UserReviews() {
  const { toast } = useToast();
  const { data: reviewsResponse, refetch } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: () => reviewService.getUserReviews(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders"],
    queryFn: orderService.getMyOrders,
  });

  const reviews: Review[] = reviewsResponse?.data || [];
  const reviewedProductIds = new Set(reviews.map((r) => r.product));
  const deliveredOrders = orders.filter(
    (o: any) => (o.status || "").toLowerCase() === "delivered"
  );
  const productsToReview = deliveredOrders.flatMap((order: any) =>
    (order.orderItems || []).filter(
      (item: any) => !reviewedProductIds.has(item.product)
    )
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const openReviewModal = (product: any) => {
    setReviewProduct(product);
    setRating(0);
    setText("");
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
      toast({ title: "Success", description: "Review submitted!" });
      setModalOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await reviewService.deleteReview(reviewId);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (!reviews.length) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            My Reviews
          </h2>
          <p className="text-sm text-gray-500">
            You haven&apos;t written any reviews yet. Browse products to get
            started.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            Once you review a product, it will appear here for easy access.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            Browse products to review
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          My Reviews
        </h2>
        <p className="text-sm text-gray-500">
          Manage recent feedback, write new reviews, and remove ones you no
          longer need.
        </p>
      </div>

      {productsToReview.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Reviews
            </h3>
            <span className="text-sm font-medium text-gray-500">
              {productsToReview.length} item(s)
            </span>
          </div>
          <div className="space-y-4">
            {productsToReview.map((item: any) => (
              <div
                key={item.product}
                className="flex flex-col gap-3 rounded-xl border border-yellow-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {item.name || item.product?.name || "Product"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>
                <Button onClick={() => openReviewModal(item)}>
                  Write Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Link
                  href={`/products/${review.product}`}
                  className="text-lg font-semibold text-gray-900 hover:text-brand-yellow"
                >
                  View Product
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-medium text-gray-500">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteReview(review._id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">{review.review}</p>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900">
                {reviewProduct?.name ||
                  reviewProduct?.product?.name ||
                  "Product"}
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <textarea
              className="h-28 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-yellow focus:outline-none"
              placeholder="Share your experience with this product..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmitReview}
              disabled={!rating || !text.trim()}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
