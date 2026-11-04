"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { ChevronDown, ChevronUp, Box, SlidersHorizontal } from "lucide-react";
import categoryService from "@/services/api/category";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/app/admin/categories/types";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { getProducts } from "@/services/api/products";
import type { Product } from "@/types/product";
import useWishlist from "@/hooks/useWishlist";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import brandService from "@/services/api/brand";
// import { useToast } from '@/components/ui/use-toast';

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
    <div>
      {categories.map((cat) => {
        const isOpen = openCategoryIds.has(cat._id);
        const isSelected = selectedCategory === cat._id;
        return (
          <div key={cat._id}>
            <div className="flex items-center">
              <button
                className={`flex-1 text-left font-medium transition py-2 ${
                  isSelected
                    ? "text-brand-yellow font-semibold"
                    : "text-gray-700 hover:text-brand-yellow"
                }`}
                onClick={() => onCategorySelect(cat)}
                type="button"
              >
                {cat.name}
              </button>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <button
                  className="ml-2 p-1"
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
              <div className="ml-4 border-l border-gray-200">
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

function MobileCategoryDropdown({
  categories,
  open,
  setOpen,
}: {
  categories: Category[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const tree = buildCategoryTree(categories);

  const toggleCategory = (id: string) => {
    setOpenCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return open ? (
    <div className="fixed inset-0 z-40 bg-black/40">
      <div className="absolute left-0 top-0 w-80 max-w-full h-full bg-white shadow-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Product Category</h3>
          <button onClick={() => setOpen(false)} className="p-2 text-gray-500">
            Close
          </button>
        </div>
        <RecursiveCategoryList
          categories={tree}
          openCategoryIds={openCategoryIds}
          toggleCategory={toggleCategory}
          onCategorySelect={(cat) => cat}
          selectedCategory={""}
        />
      </div>
    </div>
  ) : null;
}

interface ProductsGallerySectionProps {
  initialProducts?: Product[];
}

function ProductGalleryContent({
  initialProducts,
}: ProductsGallerySectionProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Read filters from URL
  const urlCategory = searchParams.get("category") || "All";
  const urlBrand = searchParams.get("brand") || "All";
  const urlColor = searchParams.get("color") || "All";
  const urlReview = searchParams.get("review") || "All";
  const urlPrice = searchParams.get("price") || "All";

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [selectedColor, setSelectedColor] = useState(urlColor);
  const [selectedReview, setSelectedReview] = useState(urlReview);
  const [selectedPrice, setSelectedPrice] = useState(urlPrice);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setSelectedColor(urlColor);
    setSelectedReview(urlReview);
    setSelectedPrice(urlPrice);
  }, [urlCategory, urlBrand, urlColor, urlReview, urlPrice]);

  // Update URL when a filter changes
  const updateUrlFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Mobile state
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  // const [brandOpen, setBrandOpen] = useState(false);
  // const [colourOpen, setColourOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const [categoryOpen, setCategoryOpen] = useState(true);

  const tree = buildCategoryTree(categories);

  const toggleCategory = (id: string) => {
    setOpenCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Remove initialProducts and useState for products
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(1, 20),
    initialData: initialProducts
      ? {
          products: initialProducts,
          pagination: {
            total: initialProducts.length,
            page: 1,
            limit: initialProducts.length,
            pages: 1,
          },
        }
      : undefined,
  });
  // const products: Product[] = productsResponse?.products || [];

  // const { toast } = useToast();
  const { ids: wishlistIds, toggle: handleFavoriteToggle } = useWishlist();
  const wishlist = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  // Fetch brands from backend
  const { data: brandsResponse = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await brandService.getAllBrands();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });
  const brandOptions = [
    { label: "All", value: "All" },
    ...brandsResponse.map((b: any) => ({ label: b.name, value: b._id })),
  ];
  const colorOptions = ["All", "Red", "Blue", "Green", "Yellow"]; // Mock data

  // Filtering logic
  const filteredProducts = useMemo(() => {
    const products = productsResponse?.products || [];
    let result = products;
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) =>
          (typeof p.category === "object" &&
            p.category !== null &&
            "_id" in p.category &&
            p.category._id === selectedCategory) ||
          p.category === selectedCategory ||
          (Array.isArray(p.subCategories) &&
            p.subCategories.includes(selectedCategory))
      );
    }
    // Avoid referencing filteredProducts inside its own definition
    console.log(result, "FilteredProducts");
    if (selectedBrand !== "All") {
      result = result.filter(
        (p) =>
          (typeof p.brand === "object" &&
            p.brand !== null &&
            "_id" in p.brand &&
            p.brand._id === selectedBrand) ||
          p.brand === selectedBrand
      );
    }
    if (selectedColor !== "All") {
      result = result.filter((p) =>
        (p.colors || []).some(
          (c) => c.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }
    if (selectedReview !== "All") {
      result = [...result].sort((a, b) => {
        if (selectedReview === "review-desc")
          return (b.rating || 0) - (a.rating || 0);
        if (selectedReview === "review-asc")
          return (a.rating || 0) - (b.rating || 0);
        return 0;
      });
    }
    if (selectedPrice !== "All") {
      result = [...result].sort((a, b) => {
        if (selectedPrice === "price-desc") return b.price - a.price;
        if (selectedPrice === "price-asc") return a.price - b.price;
        return 0;
      });
    }
    return result;
  }, [
    productsResponse?.products,
    selectedCategory,
    selectedBrand,
    selectedColor,
    selectedReview,
    selectedPrice,
  ]);

  // Helper for filter chips
  const getBrandLabel = (val: string) =>
    brandOptions.find((b) => b.value === val)?.label || val;
  const getColorLabel = (val: string) =>
    colorOptions.find((c) => c === val) || val;
  const getReviewLabel = (val: string) => {
    if (val === "review-desc") return "Review: High to Low";
    if (val === "review-asc") return "Review: Low to High";
    return val;
  };
  const getPriceLabel = (val: string) => {
    if (val === "price-desc") return "Price: High to Low";
    if (val === "price-asc") return "Price: Low to High";
    return val;
  };
  const hasActiveFilters = [
    selectedBrand,
    selectedColor,
    selectedReview,
    selectedPrice,
  ].some((f) => f !== "All");

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedColor("All");
    setSelectedReview("All");
    setSelectedPrice("All");
    router.push("/products");
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["products", 2],
      queryFn: () => getProducts(2, 20),
    });
  }, [queryClient]);

  const dispatch = useDispatch();


  return (
    <div className="max-w-6xl mx-auto px-2 flex flex-col ">
      {/* Header with total and filter */}
      <div className="w-full space-y-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {filteredProducts.length} products
          </h2>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <SlidersHorizontal className="h-4 w-4 text-brand-yellow" />
            Filter and sort
          </div>
          {/* Filter chips row */}
          {hasActiveFilters && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedBrand !== "All" && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-gray-800 ring-1 ring-brand-yellow/40">
                  Brand: {getBrandLabel(selectedBrand)}
                  <button
                    onClick={() => updateUrlFilter("brand", "All")}
                    className="ml-1 text-gray-500 hover:text-red-600"
                    aria-label="Remove brand filter"
                  >
                    &times;
                  </button>
                </span>
              )}
              {selectedColor !== "All" && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-gray-800 ring-1 ring-brand-yellow/40">
                  Color: {getColorLabel(selectedColor)}
                  <button
                    onClick={() => updateUrlFilter("color", "All")}
                    className="ml-1 text-gray-500 hover:text-red-600"
                    aria-label="Remove color filter"
                  >
                    &times;
                  </button>
                </span>
              )}
              {selectedReview !== "All" && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-gray-800 ring-1 ring-brand-yellow/40">
                  {getReviewLabel(selectedReview)}
                  <button
                    onClick={() => updateUrlFilter("review", "All")}
                    className="ml-1 text-gray-500 hover:text-red-600"
                    aria-label="Remove review filter"
                  >
                    &times;
                  </button>
                </span>
              )}
              {selectedPrice !== "All" && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-gray-800 ring-1 ring-brand-yellow/40">
                  {getPriceLabel(selectedPrice)}
                  <button
                    onClick={() => updateUrlFilter("price", "All")}
                    className="ml-1 text-gray-500 hover:text-red-600"
                    aria-label="Remove price filter"
                  >
                    &times;
                  </button>
                </span>
              )}
            </div>
          )}
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {/* Color filter */}
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/20">
              <span className="shrink-0">Color</span>
              <select
                className="min-w-0 flex-1 bg-transparent font-medium text-gray-800 outline-none"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  updateUrlFilter("color", e.target.value);
                }}
              >
                <option value="All">All colors</option>
                {colorOptions
                  .filter((opt) => opt !== "All")
                  .map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            </label>
            {/* Brand filter */}
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/20">
              <span className="shrink-0">Brand</span>
              <select
                className="min-w-0 flex-1 bg-transparent font-medium text-gray-800 outline-none"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  updateUrlFilter("brand", e.target.value);
                }}
              >
                <option value="All">All brands</option>
                {brandOptions
                  .filter((opt) => opt.value !== "All")
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </label>
            {/* Review sort */}
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/20">
              <span className="shrink-0">Reviews</span>
              <select
                className="min-w-0 flex-1 bg-transparent font-medium text-gray-800 outline-none"
                value={selectedReview}
                onChange={(e) => {
                  setSelectedReview(e.target.value);
                  updateUrlFilter("review", e.target.value);
                }}
              >
                <option value="All">Recommended</option>
                <option value="review-desc">High to low</option>
                <option value="review-asc">Low to high</option>
              </select>
            </label>
            {/* Price sort */}
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/20">
              <span className="shrink-0">Price</span>
              <select
                className="min-w-0 flex-1 bg-transparent font-medium text-gray-800 outline-none"
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  updateUrlFilter("price", e.target.value);
                }}
              >
                <option value="All">Any price</option>
                <option value="price-desc">High to low</option>
                <option value="price-asc">Low to high</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="sm:px-4 lg:px-0 py-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar (filters) */}

        <div>
          {/* Mobile: Category button */}
          <div className="md:hidden mb-4">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 font-semibold text-lg shadow-sm"
              onClick={() => setMobileCatOpen(true)}
            >
              Product Category <ChevronDown className="w-5 h-5" />
            </button>
            <MobileCategoryDropdown
              categories={categories}
              open={mobileCatOpen}
              setOpen={setMobileCatOpen}
            />
            {/* Brand and Colour filters for mobile */}
            {/* <div className="mt-4">
            <details className="mb-2">
              <summary className="font-bold text-md py-2 cursor-pointer">Brand</summary>
              <ul className="pl-4">
                {brands.map((opt) => (
                  <li key={opt} className="mb-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary className="font-bold text-md py-2 cursor-pointer">Colour</summary>
              <ul className="pl-4">
                {colours.map((opt) => (
                  <li key={opt} className="mb-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div> */}
          </div>
          {/* Desktop sidebar */}
          <aside className="sticky top-4 self-start w-full md:w-[300px] bg-white border-r border-gray-200 p-4 overflow-y-auto max-h-[80vh] rounded-xl shadow-sm hidden md:block">
            {/* Product Category dropdown header */}
            <button
              onClick={() => setCategoryOpen((v) => !v)}
              className="w-full flex items-center justify-between font-bold text-md mb-4"
              type="button"
            >
              Product Category{" "}
              {categoryOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <button
              className={`mb-2 px-3 py-1 rounded ${
                selectedCategory === "All"
                  ? "bg-brand-yellow text-white"
                  : "bg-gray-100 text-gray-700"
              } w-full text-left`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categoryOpen && (
              <RecursiveCategoryList
                categories={tree}
                openCategoryIds={openCategoryIds}
                toggleCategory={toggleCategory}
                onCategorySelect={(cat) => {
                  setSelectedCategory(cat._id);
                  updateUrlFilter("category", cat._id);
                }}
                selectedCategory={selectedCategory}
              />
            )}
            {/* Brand filter */}
            {/* <div className="mb-6 mt-6">
            <button onClick={() => setBrandOpen((v) => !v)} className="w-full flex items-center justify-between font-bold text-md mb-2">
              Brand {brandOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {brandOpen && (
              <ul>
                {brands.map((opt) => (
                  <li key={opt} className="mb-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
            {/* Colour filter */}
            {/* <div className="mb-6">
            <button onClick={() => setColourOpen((v) => !v)} className="w-full flex items-center justify-between font-bold text-md mb-2">
              Colour {colourOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {colourOpen && (
              <ul>
                {colours.map((opt) => (
                  <li key={opt} className="mb-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
          </aside>
        </div>
        {/* Product grid */}
        <main>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                <Box className="w-12 h-12 mb-2" />
                <span className="text-lg font-medium">
                  No products found or available
                </span>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  image={product.imageCover}
                  price={product.price.toLocaleString()}
                  unit={product.priceUnit}
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
                        moq: product.moq || 1,
                      })
                    );
                    toast.success("Added to cart");
                  }}
                      quantity={product.quantity || 0}
                  moq={product.moq || 1}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsGallerySection({
  initialProducts,
}: ProductsGallerySectionProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          Loading...
        </div>
      }
    >
      <ProductGalleryContent initialProducts={initialProducts} />
    </Suspense>
  );
}
