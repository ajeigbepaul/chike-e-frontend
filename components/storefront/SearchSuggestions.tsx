import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
}

export function SearchSuggestions({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (suggestion: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        setSuggestions([
          { id: '1', name: 'Modern Chair', category: 'Furniture' },
          { id: '2', name: 'Wooden Table', category: 'Furniture' },
          { id: '3', name: 'Leather Sofa', category: 'Furniture' },
          { id: '4', name: 'Floor Lamp', category: 'Lighting' },
        ].filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.category.toLowerCase().includes(query.toLowerCase())
        ));
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  if (suggestions.length === 0 || query.length <= 2) return null;

  return (
    <div 
      ref={suggestionsRef}
      className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
    >
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">Loading...</div>
      ) : (
        <ul className="py-1">
          {suggestions.map((item) => (
            <li key={item.id}>
              <Link
                href={`/products/${item.id}`}
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => onSelect(item.name)}
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}