"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategoryNavigation } from "@/components/storefront/CategoryNavigation";
import categoryService from "@/services/api/category";
import { getProducts } from "@/services/api/products";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useState, useMemo, useEffect, JSX } from "react";
import ProductCard from "@/components/storefront/ProductCard";
import wishlistService from "@/services/api/wishlist";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Category } from "@/app/admin/categories/types";

// Helper function to build category tree
function buildCategoryTree(categories: Category[]): Category[] {
  const map: { [key: string]: Category & { subcategories: Category[] } } = {};
  const roots: (Category & { subcategories: Category[] })[] = [];
  categories.forEach((cat: Category) => {
    map[cat._id] = { ...cat, subcategories: [] };
  });
  categories.forEach((cat: Category) => {
    if (cat.parent && map[cat.parent]) {
      map[cat.parent].subcategories.push(map[cat._id]);
    } else {
      roots.push(map[cat._id]);
    }
  });
  return roots;
}

// Recursive category list component
function RecursiveCategoryList({
  categories,
  openCategoryIds,
  toggleCategory,
  onCategorySelect,
  selectedCategory,
}: {
  categories: Category[];
  openCategoryIds: Set<string>;
  toggleCategory: (id: string) => void;
  onCategorySelect: (category: Category) => void;
  selectedCategory: string;
}) {
  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const isOpen = openCategoryIds.has(cat._id);
        const isSelected = selectedCategory === cat._id;
        return (
          <div key={cat._id}>
            <div className="flex items-center">
              <button
                className={`flex-1 text-left font-medium transition py-2 px-3 rounded-lg ${
                  isSelected
                    ? "bg-brand-yellow/10 text-brand-yellow font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onCategorySelect(cat)}
                type="button"
              >
                {cat.name}
              </button>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <button
                  className="ml-2 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => toggleCategory(cat._id)}
                  type="button"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {cat.subcategories && cat.subcategories.length > 0 && isOpen && (
              <div className="ml-4 border-l-2 border-gray-200 pl-2">
                <RecursiveCategoryList
                  categories={cat.subcategories}
                  openCategoryIds={openCategoryIds}
                  toggleCategory={toggleCategory}
                  onCategorySelect={onCategorySelect}
                  selectedCategory={selectedCategory}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const categorySlug = typeof params?.slug === "string" ? params.slug : "";
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const isLoggedIn = !!session;

  // Fetch all categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Fetch all products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1, 100),
  });

  const categories = (categoriesData as Category[]) || [];
  const products = productsData?.products || [];

  // Find the main category by slug
  const mainCategory = categories.find((cat) => cat.slug === categorySlug);

  // Get subcategories for a specific category
  const getSubcategories = (parentId?: string) => {
    if (!parentId && !mainCategory) return [];
    const targetId = parentId || mainCategory!._id;
    return categories.filter((cat) => cat.parent === targetId);
  };

  // Get products for a specific subcategory (including nested subcategories)
  const getProductsForSubcategory = (subcategoryId: string): any[] => {
    const directProducts = products.filter(
      (product) =>
        product.category === subcategoryId ||
        product.subCategories?.includes(subcategoryId)
    );

    const nestedSubcategories = getSubcategories(subcategoryId);
    const nestedProducts = nestedSubcategories.flatMap((subcat) =>
      getProductsForSubcategory(subcat._id)
    );

    const allProducts = [...directProducts, ...nestedProducts];
    return allProducts.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p._id === product._id)
    );
  };

  // Recursively render subcategories and their products
  const renderSubcategorySection = (
    subcategory: Category,
    level: number = 0
  ): JSX.Element | null => {
    const subcategoryProducts = products.filter(
      (product) =>
        product.category === subcategory._id ||
        product.subCategories?.includes(subcategory._id)
    );

    const nestedSubcategories = getSubcategories(subcategory._id);
    const hasDirectProducts = subcategoryProducts.length > 0;
    const hasNestedSubcategories = nestedSubcategories.length > 0;

    if (!hasDirectProducts && !hasNestedSubcategories) {
      return null;
    }

    const levelStyles = [
      // Level 0 (top-level subcategories)
      {
        header: "text-2xl font-bold",
        container: "bg-white rounded-xl shadow-sm p-6",
        margin: "mt-8",
      },
      // Level 1
      {
        header: "text-xl font-semibold",
        container: "bg-gray-50 rounded-lg p-4",
        margin: "mt-6",
      },
      // Level 2+
      {
        header: "text-lg font-medium",
        container: "bg-gray-50/50 rounded-md p-3",
        margin: "mt-4",
      },
    ];

    const styles = levelStyles[Math.min(level, 2)];

    return (
      <div key={subcategory._id} className={`space-y-4 ${styles.margin}`}>
        {/* Subcategory Header */}
        <div className={`${styles.container}`}>
          <h2 className={`${styles.header} text-gray-900 mb-2`}>
            {subcategory.name}
          </h2>
          
          {/* Direct Products for this subcategory */}
          {hasDirectProducts && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subcategoryProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  image={product.imageCover}
                  price={`₦${product.price?.toLocaleString()}`}
                  unit={product.priceUnit || "each"}
                  rating={product.rating || 0}
                  reviews={
                    product.reviews ? product.reviews.length.toString() : "0"
                  }
                  isFavorite={wishlist.has(product._id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                  onAddToCart={() => {
                    dispatch(
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.imageCover,
                      })
                    );
                    toast.success("Added to cart!");
                  }}
                  isLoggedIn={isLoggedIn}
                  onRequireLogin={() => router.push("/auth/signin")}
                  quantity={product.quantity || 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Nested Subcategories */}
        {hasNestedSubcategories && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {nestedSubcategories.map((nestedSubcat) =>
              renderSubcategorySection(nestedSubcat, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Fetch wishlist on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await wishlistService.getWishlist();
        const ids = (res.data || []).map(
          (item: any) =>
            item.productId?._id ||
            item.productId ||
            item.product?._id ||
            item.product
        );
        setWishlist(new Set(ids));
      } catch {
        // Optionally show error toast
      }
    })();
  }, []);

  const handleFavoriteToggle = async (productId: string) => {
    if (wishlist.has(productId)) {
      // Remove from wishlist
      setWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (error: any) {
        setWishlist((prev) => new Set(prev).add(productId)); // revert
      }
    } else {
      // Add to wishlist
      setWishlist((prev) => new Set(prev).add(productId));
      try {
        await wishlistService.addToWishlist(productId);
      } catch (error: any) {
        setWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        }); // revert
      }
    }
  };

  // Filtering logic - Get products for this category and subcategories
  const filteredProducts = useMemo(() => {
    if (!mainCategory) return [];

    return products.filter(
      (product) =>
        product.category === mainCategory._id ||
        product.subCategories?.includes(mainCategory._id) ||
        categories
          .filter((cat) => cat.parent === mainCategory._id)
          .some(
            (subcat) =>
              product.category === subcat._id ||
              product.subCategories?.includes(subcat._id)
          )
    );
  }, [products, mainCategory, categories]);

  if (categoriesLoading || productsLoading) {
    return (
      <main className="w-full">
        <CategoryNavigation />
        <div className="max-w-6xl mx-auto px-4 py-4 relative z-50">
          <div className="mb-4">
            <Breadcrumb />
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading category...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!mainCategory) {
    return (
      <main className="w-full">
        <CategoryNavigation />
        <div className="max-w-6xl mx-auto px-4 py-4 relative z-50">
          <div className="mb-4">
            <Breadcrumb />
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600">
              The category you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const subcategories = getSubcategories();

  return (
    <main className="w-full">
      <CategoryNavigation />
      <div className="max-w-6xl mx-auto px-4 py-4 relative z-10">
        <div className="mb-4">
          <Breadcrumb />
        </div>

        {/* Main Category Header */}
        <div
          className="text-center py-12 h-80 rounded-2xl bg-cover bg-center bg-no-repeat relative mb-8"
          style={{
            backgroundImage: mainCategory.image
              ? `url(${mainCategory.image})`
              : "none",
            backgroundColor: mainCategory.image
              ? "transparent"
              : "rgb(254, 202, 202)",
          }}
        >
          <div className="absolute bg-gray-800/60 inset-0 rounded-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-white mb-2">
              {mainCategory.name}
            </h1>
            <p className="text-gray-200 max-w-2xl px-4">
              Browse our collection of {mainCategory.name.toLowerCase()} products
            </p>
          </div>
        </div>

        {/* Subcategories and Products */}
        <div className="space-y-8">
          {subcategories.length > 0 ? (
            // Use recursive rendering for nested subcategories
            subcategories.map((subcategory) =>
              renderSubcategorySection(subcategory, 0)
            )
          ) : (
            /* If no subcategories, show products directly from main category */
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All {mainCategory.name} Products
                </h2>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      title={product.name}
                      image={product.imageCover}
                      price={`₦${product.price?.toLocaleString()}`}
                      unit={product.priceUnit || "each"}
                      rating={product.rating || 0}
                      reviews={
                        product.reviews
                          ? product.reviews.length.toString()
                          : "0"
                      }
                      isFavorite={wishlist.has(product._id)}
                      onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                      onAddToCart={() => {
                        dispatch(
                          addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.imageCover,
                          })
                        );
                        toast.success("Added to cart!");
                      }}
                      isLoggedIn={isLoggedIn}
                      onRequireLogin={() => router.push("/auth/signin")}
                      quantity={product.quantity || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    No Products Found
                  </h2>
                  <p className="text-gray-600">
                    No products are available in this category yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}