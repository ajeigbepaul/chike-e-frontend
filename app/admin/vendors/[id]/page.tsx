"use client";

import { useEffect, useState } from "react";
import { VendorDetail } from "@/components/admin/VendorDetail";
import { useParams } from "next/navigation";
import vendorService from "@/services/api/vendor";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner";

export default function VendorDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await vendorService.getVendorById(params.id as string);
        if (response.success && response.data) {
          setVendor(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch vendor details");
        }
      } catch (err: any) {
        console.error("Error fetching vendor:", err);
        setError(err.message || "Failed to load vendor details");
        toast({
          title: "Error",
          description: err.message || "Failed to load vendor details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVendor();
    }
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
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
