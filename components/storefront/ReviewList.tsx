import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Flag } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import reviewService, { Review } from '@/services/api/review';
import { useSession } from 'next-auth/react';

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { toast } = useToast();

  const { data: reviewsResponse, refetch } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
  });

  const reviews = reviewsResponse?.data || [];

  const handleReportReview = async (reviewId: string, reason: string) => {
    try {
      const response = await reviewService.reportReview(reviewId, reason);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast({
        title: 'Success',
        description: 'Review reported successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to report review',
        variant: 'destructive',
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
    return <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review: Review) => (
        <div key={review._id} className="border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {review.user.photo ? (
                <img
                  src={review.user.photo}
                  alt={review.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {review.user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-medium">{review.user.name}</h4>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user?.id === review.user._id ? (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete Review
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleReportReview(review._id, 'spam')}
                      >
                        Report as Spam
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleReportReview(review._id, 'inappropriate')
                        }
                      >
                        Report as Inappropriate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleReportReview(review._id, 'false_information')
                        }
                      >
                        Report as False Information
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="mt-4 text-gray-600">{review.review}</p>
        </div>
      ))}
    </div>
  );
} 