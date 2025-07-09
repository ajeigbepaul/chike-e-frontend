"use client";

import { VendorDetail } from "@/components/admin/VendorDetail";
import { useParams } from "next/navigation";
import vendorService from "@/services/api/vendor";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";

export default function VendorDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const vendorId = params.id as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      const response = await vendorService.getVendorById(vendorId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch vendor details");
      }
      return response.data;
    },
    enabled: !!vendorId, // Only run query if vendorId is available
  });

  const vendor = data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    toast({
      title: "Error",
      description: error?.message || "Failed to load vendor details",
      variant: "destructive",
    });
    return <div className="text-red-500 text-center py-8">{error?.message || "Failed to load vendor details"}</div>;
  }

  if (!vendor) {
    return <div className="text-center py-8">Vendor not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendor: {vendor.name}</h1>
      <VendorDetail
        vendor={{
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          joinDate: vendor.joinedDate,
          totalProducts: vendor.products || 0,
          totalSales: vendor.sales || 0,
        }}
      />
    </div>
  );
}