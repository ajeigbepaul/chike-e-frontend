"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import useWishlist from "@/hooks/useWishlist";

const PLACEHOLDER = "/default-product.jpg";

export default function ProductGallery({
  images,
  productId,
  productName = "product",
}: {
  images: (string | undefined | null)[];
  productId?: string;
  productName?: string;
}) {
  // Callers have passed [] and [undefined] here, which rendered src="".
  // Normalise once so the rest of the component can assume a usable string.
  const imgs = (images ?? []).filter(
    (src): src is string => typeof src === "string" && src.trim() !== ""
  );
  const gallery = imgs.length > 0 ? imgs : [PLACEHOLDER];

  const [current, setCurrent] = useState(0);
  const { isFavorite, toggle } = useWishlist();

  // Guard against an index left over from a longer gallery.
  const safeIndex = Math.min(current, gallery.length - 1);
  const favorite = productId ? isFavorite(productId) : false;

  const prevImage = () =>
    setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-xl overflow-hidden mb-4">
        <Image
          src={gallery[safeIndex]}
          alt={`${productName} image ${safeIndex + 1}`}
          width={400}
          height={400}
          className="w-full h-96 object-cover"
        />

        {/* Favourite button (previously had no onClick at all) */}
        {productId && (
          <button
            type="button"
            aria-label={
              favorite
                ? `Remove ${productName} from favourites`
                : `Add ${productName} to favourites`
            }
            aria-pressed={favorite}
            onClick={() => toggle(productId)}
            className="absolute top-4 right-4 bg-white rounded-full p-3 shadow text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart
              className="w-5 h-5"
              fill={favorite ? "#ef4444" : "none"}
              stroke={favorite ? "#ef4444" : "currentColor"}
            />
          </button>
        )}

        {/* Carousel arrows - pointless with a single image */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
            >
              <span>&larr;</span>
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
            >
              <span>&rarr;</span>
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 mt-2">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={`rounded-lg overflow-hidden border-2 focus:outline-none ${
                safeIndex === idx ? "border-yellow-400" : "border-transparent"
              }`}
              tabIndex={0}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                width={70}
                height={70}
                className="w-16 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
