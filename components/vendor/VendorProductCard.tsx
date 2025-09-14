"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type VendorProductCardProps = {
  id: string;
  title: string;
  image?: string;
  price: string;
  quantity: number;
  moq?: number;
  category?: string;
};

export default function VendorProductCard({
  title,
  image,
  price,
  quantity,
  moq,
  category,
}: VendorProductCardProps) {
  return (
    <Card className="overflow-hidden border rounded-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-gray-50">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="text-sm text-gray-500">{category || ""}</div>
        <h3 className="font-medium line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-semibold">{price}</span>
          <span className="text-xs text-gray-500">Qty: {quantity}</span>
        </div>
        {typeof moq === "number" && (
          <div className="text-xs text-gray-500">MOQ: {moq}</div>
        )}
      </CardContent>
    </Card>
  );
}
