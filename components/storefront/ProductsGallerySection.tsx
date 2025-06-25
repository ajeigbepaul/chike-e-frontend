"use client"
import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import categoryService from "@/services/api/category";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/app/admin/categories/types";
import Link from 'next/link';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { getProducts } from '@/services/api/products';
import type { Product } from '@/types/product';
import wishlistService from '@/services/api/wishlist';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
// import { useToast } from '@/components/ui/use-toast';

const brands = ["Brand A", "Brand B", "Brand C"];
const colours = ["Red", "Blue", "Green", "Yellow"];

function buildCategoryTree(categories: Category[]): Category[] {
  const map: { [key: string]: Category & { subcategories: Category[] } } = {};
  const roots: (Category & { subcategories: Category[] })[] = [];
  categories.forEach((cat: Category) => { map[cat._id] = { ...cat, subcategories: [] }; });
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
}: {
  categories: Category[];
  openCategoryIds: Set<string>;
  toggleCategory: (id: string) => void;
}) {
  return (
    <div>
      {categories.map(cat => {
        const isOpen = openCategoryIds.has(cat._id);
        return (
          <div key={cat._id}>
            <button
              className="w-full flex items-center justify-between text-left font-medium text-gray-700 hover:text-brand-yellow transition py-2"
              onClick={() => cat.subcategories?.length && toggleCategory(cat._id)}
              type="button"
            >
              {cat.name}
              {cat.subcategories && cat.subcategories.length > 0 && (
                isOpen
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {cat.subcategories && cat.subcategories.length > 0 && isOpen && (
              <div className="ml-4 border-l border-gray-200">
                <RecursiveCategoryList
                  categories={cat.subcategories}
                  openCategoryIds={openCategoryIds}
                  toggleCategory={toggleCategory}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MobileCategoryDropdown({ categories, open, setOpen }: {
  categories: Category[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(new Set());
  const tree = buildCategoryTree(categories);

  const toggleCategory = (id: string) => {
    setOpenCategoryIds(prev => {
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
          <h3 className="font-bold text-lg">Product Category</h3>
          <button onClick={() => setOpen(false)} className="p-2 text-gray-500">Close</button>
        </div>
        <RecursiveCategoryList
          categories={tree}
          openCategoryIds={openCategoryIds}
          toggleCategory={toggleCategory}
        />
      </div>
    </div>
  ) : null;
}

interface ProductsGallerySectionProps {
  initialProducts?: Product[];
}

export default function ProductsGallerySection({ initialProducts }: ProductsGallerySectionProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Mobile state
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [colourOpen, setColourOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(new Set());
  const [categoryOpen, setCategoryOpen] = useState(true);

  const tree = buildCategoryTree(categories);

  const toggleCategory = (id: string) => {
    setOpenCategoryIds(prev => {
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
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ['products'],
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
  const products: Product[] = productsResponse?.products || [];

  // const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Fetch wishlist on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await wishlistService.getWishlist();
        // Assuming res.data is an array of wishlist items with productId or product._id
        const ids = (res.data || []).map((item: any) => item.productId?._id || item.productId || item.product?._id || item.product);
        setWishlist(new Set(ids));
      } catch (error: any) {
        // Optionally show error toast
      }
    })();
  }, []);

  const handleFavoriteToggle = async (productId: string) => {
    if (wishlist.has(productId)) {
      // Remove from wishlist
      setWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      try {
        await wishlistService.removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } catch (error: any) {
        toast.error(error.message);
        setWishlist(prev => new Set(prev).add(productId)); // revert
      }
    } else {
      // Add to wishlist
      setWishlist(prev => new Set(prev).add(productId));
      try {
        await wishlistService.addToWishlist(productId);
        toast.success('Added to wishlist' );
      } catch (error: any) {
        toast.error(error.message);
        setWishlist(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        }); // revert
      }
    }
  };

  // Filtering logic
  const filteredProducts = products; // Remove filters that reference non-existent properties

  // Filter arrays
  const colorOptions = ['Red', 'Blue', 'Green', 'Yellow'];
  const brandOptions = ['Brand A', 'Brand B', 'Brand C'];
  const typeOptions = ['Indoor', 'Outdoor', 'Construction'];
  const reviewOptions = [
    { label: 'Review: High to Low', value: 'review-desc' },
    { label: 'Review: Low to High', value: 'review-asc' },
  ];
  const priceOptions = [
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
  ];
  const typeFilterOptions = typeOptions.map(type => ({ label: `Type: ${type}`, value: `type-${type.toLowerCase()}` }));

  // Combine all filter options for the select
  const filterOptions = useMemo(() => [...reviewOptions, ...priceOptions, ...typeFilterOptions], []);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedReview, setSelectedReview] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['products', 2],
      queryFn: () => getProducts(2, 20),
    });
  }, [queryClient]);

  const dispatch = useDispatch();

  return (
    <div className="max-w-6xl mx-auto px-2 flex flex-col ">
      {/* Header with total and filter */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl font-bold">{filteredProducts.length} products</h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-end">
          {/* Color filter */}
          <select
            className=" w-[15%] border border-gray-300 rounded-full bg-[#F3F3F3] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            value={selectedColor}
            onChange={e => setSelectedColor(e.target.value)}
          >
            <option value="">Color</option>
            {colorOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Brand filter */}
          <select
            className="border w-[15%] border-gray-300 rounded-full bg-[#F3F3F3] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
          >
            <option value="">Brand</option>
            {brandOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Type filter */}
          <select
            className="border w-[15%] border-gray-300 rounded-full bg-[#F3F3F3] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">Type</option>
            {typeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Review sort */}
          <select
            className="border w-[15%] border-gray-300 rounded-full bg-[#F3F3F3] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            value={selectedReview}
            onChange={e => setSelectedReview(e.target.value)}
          >
            <option value="">Review</option>
            {reviewOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Price sort */}
          <select
            className="border  w-[15%] border-gray-300 rounded-full bg-[#F3F3F3] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            value={selectedPrice}
            onChange={e => setSelectedPrice(e.target.value)}
          >
            <option value="">Price</option>
            {priceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="sm:px-4 lg:px-0 py-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">

      {/* Sidebar (filters) */}

      <div>
        {/* Mobile: Category button */}
        <div className="md:hidden mb-4">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 font-bold text-lg shadow-sm"
            onClick={() => setMobileCatOpen(true)}
          >
            Product Category <ChevronDown className="w-5 h-5" />
          </button>
          <MobileCategoryDropdown categories={categories} open={mobileCatOpen} setOpen={setMobileCatOpen} />
          {/* Brand and Colour filters for mobile */}
          <div className="mt-4">
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
          </div>
        </div>
        {/* Desktop sidebar */}
        <aside className="sticky top-4 self-start w-full md:w-[300px] bg-white border-r border-gray-200 p-4 overflow-y-auto max-h-[80vh] rounded-xl shadow-sm hidden md:block">
          {/* Product Category dropdown header */}
          <button
            onClick={() => setCategoryOpen((v) => !v)}
            className="w-full flex items-center justify-between font-bold text-md mb-4"
            type="button"
          >
            Product Category {categoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {categoryOpen && (
            <RecursiveCategoryList
              categories={tree}
              openCategoryIds={openCategoryIds}
              toggleCategory={toggleCategory}
            />
          )}
          {/* Brand filter */}
          <div className="mb-6 mt-6">
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
          </div>
          {/* Colour filter */}
          <div className="mb-6">
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
          </div>
        </aside>
      </div>
      {/* Product grid */}
      <main>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  image={product.imageCover}
                  price={product.price.toLocaleString()}
                  unit={product.priceUnit}
                  rating={product.rating || 0}
                  reviews={product.reviews ? product.reviews.length.toString() : '0'}
                  isFavorite={wishlist.has(product._id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product._id)}
                  onAddToCart={() => {
                    dispatch(addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.imageCover
                    }));
                    toast.success('Added to cart');
                  }}
                />
              ))}
        </div>
      </main>
      </div>
    </div>
  );
} 