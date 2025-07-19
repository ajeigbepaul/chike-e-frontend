"use client";

import { PromotionForm } from "@/components/admin/PromotionForm";
import { getPromotion } from "@/services/api/promotion";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

interface EditPromotionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPromotionPage({ params }: EditPromotionPageProps) {
  const { id } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["promotion", id],
    queryFn: () => getPromotion(id),
    enabled: !!id, // Only run query if id is available
  });

  if (isLoading) return <div>Loading promotion...</div>;
  if (isError) return <div>Error loading promotion.</div>;

  const promotion = data?.data?.promotion;

  if (!promotion) return <div>Promotion not found.</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Promotion</h1>
      <PromotionForm promotion={promotion} />
    </div>
  );
}
