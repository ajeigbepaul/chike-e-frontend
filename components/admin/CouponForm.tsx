"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.string().min(1, "Value is required"),
  startDate: z.date(),
  endDate: z.date(),
  minimumPurchase: z.string().optional(),
  maximumDiscount: z.string().optional(),
  isActive: z.boolean(),
  appliesTo: z.enum([
    "all_products",
    "specific_categories",
    "specific_products",
  ]),
  categories: z.array(z.string()).optional(),
  products: z.array(z.string()).optional(),
  usageLimit: z.string().optional(),
  customerLimit: z.string().optional(),
  customerGroups: z.array(z.string()).optional(),
  excludeProducts: z.array(z.string()).optional(),
  excludeCategories: z.array(z.string()).optional(),
  freeShipping: z.boolean(),
  firstTimeOnly: z.boolean(),
});

type CouponFormProps = {
  coupon?: any; // Replace with your coupon type
  categories: any[]; // Replace with your category type
  products: any[]; // Replace with your product type
  customerGroups: any[]; // Replace with your customer group type
  onSubmit: (data: z.infer<typeof couponSchema>) => void;
};

export function CouponForm({
  coupon,
  categories,
  products,
  customerGroups,
  onSubmit,
}: CouponFormProps) {
  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || "",
      description: coupon?.description || "",
      type: coupon?.type || "percentage",
      value: coupon?.value?.toString() || "",
      startDate: coupon?.startDate ? new Date(coupon.startDate) : new Date(),
      endDate: coupon?.endDate ? new Date(coupon.endDate) : new Date(),
      minimumPurchase: coupon?.minimumPurchase?.toString() || "",
      maximumDiscount: coupon?.maximumDiscount?.toString() || "",
      isActive: coupon?.isActive ?? true,
      appliesTo: coupon?.appliesTo || "all_products",
      categories: coupon?.categories || [],
      products: coupon?.products || [],
      usageLimit: coupon?.usageLimit?.toString() || "",
      customerLimit: coupon?.customerLimit?.toString() || "",
      customerGroups: coupon?.customerGroups || [],
      excludeProducts: coupon?.excludeProducts || [],
      excludeCategories: coupon?.excludeCategories || [],
      freeShipping: coupon?.freeShipping ?? false,
      firstTimeOnly: coupon?.firstTimeOnly ?? false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("type") === "percentage"
                      ? "Percentage"
                      : "Amount"}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Enable or disable this coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumPurchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Purchase</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum purchase amount required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Discount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum discount amount allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliesTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applies To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all_products">All Products</SelectItem>
                      <SelectItem value="specific_categories">
                        Specific Categories
                      </SelectItem>
                      <SelectItem value="specific_products">
                        Specific Products
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("appliesTo") === "specific_categories" && (
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange([...(field.value || []), value])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("appliesTo") === "specific_products" && (
              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange([...(field.value || []), value])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select products" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times this coupon can be used
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times a customer can use this coupon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerGroups"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Groups</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange([...(field.value || []), value])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer groups" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Restrict coupon to specific customer groups
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freeShipping"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Free Shipping</FormLabel>
                    <FormDescription>
                      Apply free shipping with this coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstTimeOnly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>First Time Only</FormLabel>
                    <FormDescription>
                      Restrict coupon to first-time customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            {coupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
