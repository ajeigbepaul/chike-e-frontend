"use client"
import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import categoryService from "@/services/api/category";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/app/admin/categories/types";

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

export default function ProductSidebar() {
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

  // --- Product grid mock data ---
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: i === 1 ? 'Square steel pipes' : 'Galvanized steel, 40kg',
    image: `/feature${(i % 4) + 1}.jpg`,
    price: 25000 + i * 1000,
    unit: 'm3',
    rating: 4.8 - (i % 3) * 0.2,
    reviews: 4800 - i * 100,
    isFavorite: i % 3 === 0,
    color: ['Red', 'Blue', 'Green', 'Yellow'][i % 4],
    brand: ['Brand A', 'Brand B', 'Brand C'][i % 3],
    type: ['Indoor', 'Outdoor', 'Construction'][i % 3],
  }));

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

  // Filter and sort products based on selected filters
  let displayedProducts = [...products];
  if (selectedColor) {
    displayedProducts = displayedProducts.filter(p => p.color === selectedColor);
  }
  if (selectedBrand) {
    displayedProducts = displayedProducts.filter(p => p.brand === selectedBrand);
  }
  if (selectedType) {
    displayedProducts = displayedProducts.filter(p => p.type === selectedType);
  }
  if (selectedReview === 'review-desc') {
    displayedProducts.sort((a, b) => b.rating - a.rating);
  } else if (selectedReview === 'review-asc') {
    displayedProducts.sort((a, b) => a.rating - b.rating);
  }
  if (selectedPrice === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (selectedPrice === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  }

  return (
    <div className="max-w-6xl mx-auto px-2 flex flex-col ">
      {/* Header with total and filter */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-2xl font-bold">{displayedProducts.length} products</h2>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="relative bg-white rounded-xl  overflow-hidden group flex flex-col h-full">
              <div className="relative h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-brand-yellow hover:bg-brand-yellow hover:text-white transition">
                  {/* Heart icon placeholder */}
                  <svg className="w-5 h-5" fill={product.isFavorite ? '#F7B50E' : 'none'} stroke="#F7B50E" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1 w-full">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {/* Star icon placeholder */}
                    <svg className="w-4 h-4 text-yellow-400" fill="#F7B50E" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                    <span>({product.reviews} reviews)</span>
                  </div>
                  <button className="ml-2 bg-gray-100 hover:bg-brand-yellow text-brand-yellow hover:text-white rounded-full p-2 transition flex items-center justify-center w-10 h-10">
                    {/* Shopping cart icon placeholder */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" /></svg>
                  </button>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
                <div className="flex items-center text-sm text-gray-700 font-medium mb-1">
                  <span>{product.price.toLocaleString()}/ <span className="text-xs">{product.unit}</span></span>
                  <span className="text-xs text-gray-400 ml-2 mt-1">Delivery: 7 - 9 days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
} 