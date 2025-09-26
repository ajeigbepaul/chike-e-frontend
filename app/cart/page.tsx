"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  updateQuantity,
  removeFromCart,
  calculateSubtotal,
  calculateVAT,
  calculateTotalWithVAT,
} from "@/store/cartSlice";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import reviewService from "@/services/api/review";
import ReviewForm from "@/components/storefront/ReviewForm";
import ReviewList from "@/components/storefront/ReviewList";
import { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

function CartPageContent() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [selectedProductForReview, setSelectedProductForReview] = useState<
    string | null
  >(null);

  // Calculate dynamic values using cart utility functions
  const itemsTotal = calculateSubtotal(cart);
  const vat = calculateVAT(cart);
  const total = calculateTotalWithVAT(cart);

  // Get all product IDs from cart
  const productIds = cart.map((item) => item.id);

  // Fetch reviews for all products in cart
  const { data: allReviewsData } = useQuery({
    queryKey: ["cart-reviews", productIds],
    queryFn: async () => {
      const reviewsPromises = productIds.map((id) =>
        reviewService.getProductReviews(id).catch(() => ({ data: [] }))
      );
      const results = await Promise.all(reviewsPromises);
      return results.reduce((acc, result, index) => {
        acc[productIds[index]] = result.data || [];
        return acc;
      }, {} as Record<string, any[]>);
    },
    enabled: productIds.length > 0,
  });

  // Helper function to get reviews for a specific product
  const getProductReviews = (productId: string) => {
    return allReviewsData?.[productId] || [];
  };

  // Helper function to calculate average rating
  const getAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  };

  // Disable checkout if any cart item's quantity is less than its moq
  const isCheckoutDisabled = cart.some(
    (item) => item.quantity < (item.moq || 1)
  );

  // Check if user just logged in successfully
  const loginSuccess = searchParams.get("login_success");

  useEffect(() => {
    // Show success message if user just logged in
    if (loginSuccess === "1") {
      toast.success(
        "Successfully logged in! You can now proceed to checkout.",
        {
          duration: 4000,
          icon: "✅",
        }
      );

      // Clean up the URL by removing the login_success parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("login_success");
      const newUrl = `${window.location.pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }`;
      router.replace(newUrl);
    }
  }, [loginSuccess, searchParams, router]);

  const handleRoute = () => {
    if (isCheckoutDisabled) {
      toast.error("Please ensure all items meet their minimum order quantity.");
    }
    if (!session) {
      // This shouldn't happen due to middleware, but just in case
      toast.error("Please log in to proceed to checkout");
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent("/cart"));
      return;
    }

    // User is authenticated, proceed to checkout
    router.push("/checkout");
  };
  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-10">
      <Suspense
        fallback={
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        }
      >
        <Breadcrumb />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Your cart ({cart.length} Item{cart.length !== 1 ? "s" : ""})
          </h2>
          {cart.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                console.log(item, "item");
                const reviews = getProductReviews(item.id);
                const averageRating = getAverageRating(reviews);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white rounded-lg border p-4 relative"
                  >
                    {/* Checkbox (optional) */}
                    <input type="checkbox" className="mr-2" />
                    {/* Product Image */}
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 flex items-center gap-1 text-sm font-semibold">
                          <Star className="w-4 h-4" fill="#F7B50E" />
                          {averageRating > 0
                            ? averageRating.toFixed(1)
                            : "No rating"}
                          <span className="text-gray-400">
                            ({reviews.length} review
                            {reviews.length !== 1 ? "s" : ""})
                          </span>
                          {item?.moq && item?.moq > 1 && (
                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
                              Min. order: {item?.moq}
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="font-bold text-lg truncate mb-1">
                        {item.name}
                      </div>
                      <div className="text-gray-700 font-semibold mb-1">
                        ₦{item.price.toLocaleString()}/ m3{" "}
                        <span className="text-xs text-gray-400 ml-2">
                          Delivery: 7 - 9 days
                        </span>
                      </div>

                      {/* Review Button */}
                      <div className="mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() =>
                                setSelectedProductForReview(item.id)
                              }
                            >
                              {reviews.length > 0
                                ? "View Reviews"
                                : "Write Review"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Reviews for {item.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Review Form */}
                              <div className="border-b pb-4">
                                <h3 className="font-semibold mb-3">
                                  Write a Review
                                </h3>
                                <ReviewForm
                                  productId={item.id}
                                  onSuccess={() => {
                                    // Refetch reviews after successful submission
                                    window.location.reload();
                                  }}
                                />
                              </div>

                              {/* Review List */}
                              <div>
                                <h3 className="font-semibold mb-3">
                                  All Reviews
                                </h3>
                                <ReviewList productId={item.id} />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        //             disabled={
                        //   outOfStock ||
                        //   quantity <= (product.moq || 1) ||
                        //   !!(quote && quote.status === "accepted")
                        // }
                        disabled={item.quantity <= 1}
                      >
                        –
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          dispatch(
                            updateQuantity({ id: item.id, quantity: val })
                          );
                        }}
                        className="text-center border rounded px-2 py-2 w-10"
                      />
                      <button
                        className="px-2 py-1 rounded border border-gray-300 bg-white text-lg disabled:opacity-50"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    {/* Remove Button */}
                    <button
                      className="ml-4 text-red-500 hover:bg-red-50 rounded-full p-2 transition absolute top-1 right-2"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      title="Remove"
                    >
                      <Image
                        src="/delete.svg"
                        alt="Delete"
                        width={30}
                        height={30}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Cart Details */}
        <div className="w-full md:w-[350px] bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Cart Details</h3>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Items ({cart.length})</span>
              <span>
                ₦
                {itemsTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>VAT</span>
              <span>₦{vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>SubTotal</span>
              <span className="text-brand-yellow">
                ₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            disabled={isCheckoutDisabled}
            onClick={handleRoute}
            className={`w-full ${
              isCheckoutDisabled
                ? "bg-gray-300"
                : "bg-gray-900 hover:bg-brand-yellow hover:text-gray-900"
            } text-white py-3 rounded-full font-semibold text-lg  transition`}
          >
            Checkout ₦
            {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading cart...
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
