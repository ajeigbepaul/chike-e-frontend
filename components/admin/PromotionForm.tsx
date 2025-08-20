"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Promotion } from "@/types/promotion";
import { createPromotion, updatePromotion } from "@/services/api/promotion";
import { Loader2 } from "lucide-react";

interface PromotionFormProps {
  promotion?: Promotion;
}

export function PromotionForm({ promotion }: PromotionFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<Promotion>>(() => {
    if (promotion) {
      return {
        ...promotion,
        startDate: promotion.startDate.split('T')[0],
        endDate: promotion.endDate.split('T')[0],
      };
    } else {
      return {
        name: "",
        type: "percentage",
        value: 0,
        startDate: "",
        endDate: "",
        isActive: true,
        applicableTo: "all_products",
        minimumOrderAmount: 0,
        // maximumDiscountAmount: undefined,
        usageLimit: undefined,
      };
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean | null;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      newValue = value === "" ? null : Number(value);
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const createMutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      toast.success("Promotion created successfully!");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      router.push("/admin/promotions");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create promotion");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; promotionData: Partial<Promotion> }) =>
      updatePromotion(data.id, data.promotionData),
    onSuccess: () => {
      toast.success("Promotion updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      router.push("/admin/promotions");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update promotion");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promotion) {
      updateMutation.mutate({ id: promotion._id, promotionData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold">
        {promotion ? "Edit Promotion" : "Create New Promotion"}
      </h2>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Promotion Name *</label>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Promotion Type *</label>
            <select
              name="type"
              value={formData.type || "percentage"}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed_amount">Fixed Amount Discount</option>
              {/* <option value="buy_x_get_y">Buy X Get Y</option> */}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Value *</label>
            <Input
              type="number"
              name="value"
              value={formData.value ?? ""}
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Start Date *</label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date *</label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Is Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleChange}
              className="ml-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Applicable To *</label>
            <select
              name="applicableTo"
              value={formData.applicableTo || "all_products"}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="all_products">All Products</option>
              {/* <option value="specific_products">Specific Products</option>
              <option value="specific_categories">Specific Categories</option> */}
            </select>
          </div>

          {/* Conditional fields based on applicableTo */}
          {/* You would typically add product/category selectors here */}
          {/* For brevity, I'm omitting the complex selectors for now */}

          <div>
            <label className="text-sm font-medium">Minimum Order Amount</label>
            <Input
              type="number"
              name="minimumOrderAmount"
              value={formData.minimumOrderAmount ?? ""}
              onChange={handleChange}
              min={0}
            />
          </div>

          {/* <div>
            <label className="text-sm font-medium">Maximum Discount Amount</label>
            <Input
              type="number"
              name="maximumDiscountAmount"
              value={formData.maximumDiscountAmount ?? ""}
              onChange={handleChange}
              min={0}
              placeholder="No limit"
            />
          </div> */}

          <div>
            <label className="text-sm font-medium">Usage Limit</label>
            <Input
              type="number"
              name="usageLimit"
              value={formData.usageLimit ?? ""}
              onChange={handleChange}
              min={0}
              placeholder="No limit"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {promotion ? "Update Promotion" : "Create Promotion"}
        </Button>
      </div>
    </form>
  );
}