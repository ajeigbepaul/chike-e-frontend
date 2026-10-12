"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildQuoteSchema } from "@/lib/quoteSchema";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitQuoteRequest, type QuoteRequest } from "@/services/api/quote";
import type { Product } from "@/types/product";

interface RequestQuoteDialogProps {
  product: Product;
  children: React.ReactNode;
  onSubmitQuote?: (quoteData: Omit<QuoteRequest, 'productId' | 'productName'>) => Promise<void>;
  isLoading?: boolean;
}

type QuoteFormData = z.infer<ReturnType<typeof buildQuoteSchema>>;

export default function RequestQuoteDialog({ product, children, onSubmitQuote, isLoading }: RequestQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  
  const moq = Math.max(1, Math.floor(product.moq ?? 1));
  const quoteSchema = useMemo(() => buildQuoteSchema(moq), [moq]);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    // Stay quiet until a field is left, then correct live as it is fixed.
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      quantity: String(moq),
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      company: "",
      message: "",
      expectedPrice: "",
      urgency: "medium",
    },
  });

  const quoteMutation = useMutation({
    mutationFn: (data: QuoteRequest) => submitQuoteRequest(data),
    onSuccess: () => {
      toast.success("Quote request submitted successfully! We'll get back to you soon.");
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit quote request");
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    // Validated as text; the API takes numbers. Optional fields go as
    // undefined rather than "" so they are omitted, not stored blank.
    const payload = {
      quantity: Number(data.quantity),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || undefined,
      company: data.company || undefined,
      message: data.message || undefined,
      expectedPrice: data.expectedPrice ? Number(data.expectedPrice) : undefined,
      urgency: data.urgency,
    };

    if (onSubmitQuote) {
      // Use external submission handler
      try {
        await onSubmitQuote(payload);
        setOpen(false);
        form.reset();
      } catch {
        // Error handling is done in the hook
      }
    } else {
      // Use internal submission (legacy behavior)
      quoteMutation.mutate({
        productId: product._id,
        productName: product.name,
        ...payload,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a quote for "{product.name}". We'll get back to you with pricing and availability information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <img 
              src={product.imageCover} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <h4 className="font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600">
                Current Price: ₦{product.price.toLocaleString()}/{product.priceUnit}
              </p>
              <p className="text-sm text-gray-600">
                Available Stock: {product.quantity} units
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        {...field}
                        onChange={(e) =>
                          // Digits only, so "2.5" and "abc" can't be typed.
                          field.onChange(e.target.value.replace(/[^\d]/g, ""))
                        }
                        onBlur={(e) => {
                          // Tidy "05" to "5" rather than scolding the user.
                          const digits = e.target.value.replace(/^0+(?=\d)/, "");
                          if (digits !== e.target.value) field.onChange(digits);
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+234 xxx xxx xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Price per Unit (₦)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="Optional: Your expected price"
                      {...field}
                      onChange={(e) =>
                        // Digits and at most one decimal point.
                        field.onChange(
                          e.target.value
                            .replace(/[^\d.]/g, "")
                            .replace(/(\..*)\./g, "$1")
                        )
                      }
                      onBlur={(e) => {
                        const tidied = e.target.value
                          .replace(/^0+(?=\d)/, "")
                          .replace(/\.$/, "");
                        if (tidied !== e.target.value) field.onChange(tidied);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional requirements, specifications, or questions about this product..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isLoading || quoteMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || quoteMutation.isPending}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {(isLoading || quoteMutation.isPending) ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
