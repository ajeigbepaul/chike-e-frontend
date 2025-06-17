"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Category } from '@/app/admin/categories/types';

interface CategoryDropdownProps {
  categories: Category[];
  trigger: React.ReactNode;
}

export function CategoryDropdown({ categories, trigger }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverPath, setHoverPath] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoverPath([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build category tree (keep your existing implementation)
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const map: { [key: string]: Category & { subcategories: Category[] } } = {};
    const roots: (Category & { subcategories: Category[] })[] = [];

    // Initialize map and subcategories
    categories.forEach(cat => {
      map[cat._id] = { ...cat, subcategories: [] };
    });

    // Build the tree
    categories.forEach(cat => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].subcategories.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    // Sort root categories by order
    roots.sort((a, b) => a.order - b.order);

    // Recursively sort subcategories
    function sortSubcategories(category: Category & { subcategories: Category[] }) {
      category.subcategories.sort((a, b) => a.order - b.order);
      category.subcategories.forEach(sub => sortSubcategories(sub as Category & { subcategories: Category[] }));
    }

    roots.forEach(sortSubcategories);
    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  // Check if a category is in the current hover path
  const isInHoverPath = (categoryId: string) => {
    return hoverPath.includes(categoryId);
  };

  // Get the hover path for a category
  const getHoverPath = (category: Category): string[] => {
    const path: string[] = [category._id];
    let current = category;
    while (current.parent) {
      path.unshift(current.parent);
      current = categories.find(c => c._id === current.parent)!;
    }
    return path;
  };

  // Recursive component to render category levels
//   const renderCategoryLevel = (categoryList: Category[], level = 0, parentPath: string[] = []) => {
//     return (
//       <div 
//         className={`py-1 ${level > 0 ? 'min-w-[200px]' : ''}`}
//         onMouseLeave={() => level > 0 && setHoverPath(parentPath)}
//         ref={level > 0 ? (node) => {
//           if (node) {
//             const rect = node.getBoundingClientRect();
//             const shouldOpenLeft = rect.right + 200 > window.innerWidth;
//             node.style.left = shouldOpenLeft ? 'auto' : '100%';
//             node.style.right = shouldOpenLeft ? '100%' : 'auto';
//           }
//         } : undefined}
//       >
//         {categoryList.map((category) => {
//           const currentPath = [...parentPath, category._id];
//           const shouldShow = level === 0 || isInHoverPath(category._id);
          
//           return (
//             <div
//               key={category._id}
//               className="relative group"
//               onMouseEnter={() => setHoverPath(getHoverPath(category))}
//             >
//               <Link
//                 href={`/products?category=${category._id}`}
//                 className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow transition-colors whitespace-nowrap ${
//                   isInHoverPath(category._id) ? 'bg-brand-yellow/10 text-brand-yellow' : ''
//                 }`}
//                 onClick={() => setIsOpen(false)}
//               >
//                 <span>{category.name}</span>
//                 {category.subcategories && category.subcategories.length > 0 && (
//                   <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
//                 )}
//               </Link>
              
//               {/* Subcategories mega menu */}
//               {category.subcategories && category.subcategories.length > 0 && shouldShow && (
//                 <div
//                   className={`absolute left-full top-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${
//                     isInHoverPath(category._id) ? 'opacity-100 visible' : 'opacity-0 invisible'
//                   }`}
//                   style={{ 
//                     marginLeft: '-1px',
//                     minWidth: '200px',
//                   }}
//                 >
//                   {renderCategoryLevel(category.subcategories, level + 1, currentPath)}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };
const renderCategoryLevel = (categoryList: Category[], level = 0, parentPath: string[] = []) => {
    return (
      <div 
        className={`py-1 ${level > 0 ? 'min-w-[240px]' : ''}`}
        onMouseLeave={() => level > 0 && setHoverPath(parentPath)}
      >
        {categoryList.map((category) => {
          const currentPath = [...parentPath, category._id];
          const shouldShow = level === 0 || isInHoverPath(category._id);
          
          return (
            <div
              key={category._id}
              className="relative group"
              onMouseEnter={() => setHoverPath(getHoverPath(category))}
              ref={node => {
                if (node && level >= 2) {
                  const rect = node.getBoundingClientRect();
                  const wouldOverflow = rect.right + 240 > window.innerWidth;
                  if (wouldOverflow) {
                    node.querySelector('.submenu')?.classList.remove('left-full');
                    node.querySelector('.submenu')?.classList.add('right-full');
                  }
                }
              }}
            >
              <Link
                href={`/products?category=${category._id}`}
                className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow transition-colors whitespace-nowrap ${
                  isInHoverPath(category._id) ? 'bg-brand-yellow/10 text-brand-yellow' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{category.name}</span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
                )}
              </Link>
              
              {/* Subcategories mega menu */}
              {category.subcategories && category.subcategories.length > 0 && shouldShow && (
                <div
                  className={`submenu absolute left-full top-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] ${
                    isInHoverPath(category._id) ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  style={{ 
                    marginLeft: level >= 2 ? '0' : '-1px',
                  }}
                >
                  {renderCategoryLevel(category.subcategories, level + 1, currentPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center"
        onMouseLeave={() => !isOpen && setHoverPath([])}
      >
        {/* Main Products link - no hover behavior */}
        <Link 
          href="/products" 
          className="text-foreground hover:text-brand-yellow transition-colors"
        >
          Products
        </Link>
        
        {/* Caret icon - click to toggle dropdown */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-foreground hover:text-brand-yellow transition-colors focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle products dropdown"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]"
          onMouseLeave={() => {
            setIsOpen(false);
            setHoverPath([]);
          }}
        >
          {renderCategoryLevel(categoryTree)}
        </div>
      )}
    </div>
  );
}