import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAutocompleteSuggestions } from '@/services/api/products';
import Image from 'next/image';

export function SearchSuggestions({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (suggestion: string) => void;
}) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce the query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => debouncedQuery.length > 2 ? getAutocompleteSuggestions(debouncedQuery) : [],
    enabled: debouncedQuery.length > 2,
    staleTime: 60 * 1000, // 1 minute
  });

  if (!suggestions.length || query.length <= 2) return null;

  return (
    <div 
      ref={suggestionsRef}
      className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
    >
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">Loading...</div>
      ) : (
        <ul className="py-1">
          {suggestions.map((item, index) => (
            <li key={item.slug || index}>
              <Link
                href={`/products/${item.slug}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => onSelect(item.name)}
              >
                {item.imageCover && (
                  <Image width={24} height={24} src={item.imageCover} alt={item.name} className="w-8 h-8 object-cover rounded" />
                )}
                <div>
                  <div className="font-medium">{item.name}</div>
                  {(item.category || item.brand) && (
                    <div className="text-xs text-gray-500">
                      {item.category && <span>Category: {item.category}</span>}
                      {item.category && item.brand && <span> &middot; </span>}
                      {item.brand && <span>Brand: {item.brand}</span>}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}