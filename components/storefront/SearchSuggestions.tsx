import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAutocompleteSuggestions } from "@/services/api/products";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface Suggestion {
  name: string;
  slug: string;
  imageCover?: string;
  category?: string;
  brand?: string;
  type: "product" | "tag";
  count?: number;
  _id?: string;
}

export function SearchSuggestions({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (suggestion: string, type?: "product" | "tag") => void;
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
    queryKey: ["autocomplete", debouncedQuery],
    queryFn: () =>
      debouncedQuery.length > 2
        ? getAutocompleteSuggestions(debouncedQuery)
        : [],
    enabled: debouncedQuery.length > 2,
    staleTime: 60 * 1000, // 1 minute
  });

  if (!suggestions.length || query.length <= 2) return null;
  //  console.log(suggestions,'Suggestions Here...')
  return (
    <div
      ref={suggestionsRef}
      className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
    >
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">Loading...</div>
      ) : (
        <ul className="py-1">
          {suggestions.map((item: Suggestion, index) => (
            <li key={item.slug || index}>
              {item.type === "tag" ? (
                <button
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                  onClick={() => onSelect(item.name, "tag")}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {item.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Tag
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.count} product{item.count !== 1 ? "s" : ""} with
                      this tag
                    </div>
                  </div>
                </button>
              ) : (
                <Link
                  href={`/product/${item._id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => onSelect(item.name, "product")}
                >
                  {item.imageCover ? (
                    <Image
                      width={24}
                      height={24}
                      src={item.imageCover}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {(item.category || item.brand) && (
                      <div className="text-xs text-gray-500">
                        {item.category && (
                          <span>Category: {item.category}</span>
                        )}
                        {item.category && item.brand && <span> &middot; </span>}
                        {item.brand && <span>Brand: {item.brand}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
