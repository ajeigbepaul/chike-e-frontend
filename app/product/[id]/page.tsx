"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/api/products";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductAccessories from "./ProductAccessories";
import ProductTabs from "./ProductTabs";
import ProductMoreLikeThis from "./ProductMoreLikeThis";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
  console.log("Product Details..:", product);

  if (isLoading)
    return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  if (isError || !product)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-red-500">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb productData={product} />
      <div className="flex flex-col md:flex-row gap-10">
        <ProductGallery images={product.images || [product.imageCover]} />
        <div className="flex-1">
          <ProductInfo product={product} />
        </div>
      </div>
      <ProductAccessories product={product} />
      <ProductTabs product={product} />
      <ProductMoreLikeThis product={product} />
    </div>
  );
}
