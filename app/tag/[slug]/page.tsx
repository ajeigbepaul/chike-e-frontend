"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import ProductCard from "@/components/storefront/ProductCard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
import { addToCart } from "@/store/cartSlice";
import wishlistService from "@/services/api/wishlist";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceUnit: string;
  imageCover: string;
  rating: number;
  reviewsCount: number;
  categoryName: string;
  brandName: string;
  tags: string[];
  quantity: number;
}

interface TagProductsResponse {
  status: string;
  results: number;
  data: {
    products: Product[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const getProductsByTag = async (
  tag: string,
  page: number = 1
): Promise<TagProductsResponse> => {
  const response = await api.get(
    `/products/tag/${encodeURIComponent(tag)}?page=${page}&limit=20`
  );
  return response.data;
};

export default function TagPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Extract tag from slug (remove 'tag-' prefix if present)
  const tagSlug = params.slug as string;
  const tag = tagSlug.startsWith("tag-") ? tagSlug.slice(4) : tagSlug;

  const isLoggedIn = !!session;

  // Get page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch wishlist data
  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isLoggedIn,
  });

  // Update wishlist state when data changes
  useEffect(() => {
    if (wishlistData?.data) {
      setWishlist(new Set(wishlistData.data.map((item: any) => item._id)));
    }
  }, [wishlistData]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products-by-tag", tag, currentPage],
    queryFn: () => getProductsByTag(tag, currentPage),
    enabled: !!tag,
  });

  // Wishlist toggle handler
  const handleFavoriteToggle = async (productId: string) => {
    if (wishlist.has(productId)) {
      setWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      try {
        await wishlistService.removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } catch (error: any) {
        toast.error(error.message);
        setWishlist((prev) => new Set(prev).add(productId)); // revert
      }
    } else {
      setWishlist((prev) => new Set(prev).add(productId));
      try {
        await wishlistService.addToWishlist(productId);
        toast.success("Added to wishlist");
      } catch (error: any) {
        toast.error(error.message);
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        }); // revert
      }
    }
  };

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.imageCover,
      })
    );
    toast.success("Added to cart");
  };

  // Login requirement handler
  const handleRequireLogin = () => {
    router.push("/auth/signin");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.history.pushState(null, "", `?page=${newPage}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Error Loading Products
            </h1>
            <p className="text-gray-600 mt-2">
              Something went wrong while loading products for this tag.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const products = data?.data.products || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: `Tag: ${tag}` },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Products tagged with
            </h1>
            <Badge variant="secondary" className="text-lg px-4 py-2 capitalize">
              {tag}
            </Badge>
          </div>
          {pagination && (
            <p className="text-gray-600">
              Showing {products.length} of {pagination.total} products
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  image={product.imageCover}
                  price={product.price.toLocaleString()}
                  unit={product.priceUnit}
                  rating={product.rating || 0}
                  reviews={product.reviewsCount?.toString() || "0"}
                  isFavorite={wishlist.has(product._id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                  onAddToCart={() => handleAddToCart(product)}
                  isLoggedIn={isLoggedIn}
                  onRequireLogin={handleRequireLogin}
                  quantity={product.quantity || 0}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? "bg-brand-yellow text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.pages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-4 0H9m-4 0H4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600">
              There are no products tagged with "{tag}" at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
