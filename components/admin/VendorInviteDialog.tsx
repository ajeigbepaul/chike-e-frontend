"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "react-hot-toast";
import vendorService, { VendorInviteRequest } from "@/services/api/vendor";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  role: z.enum(["vendor"]).default("vendor"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface VendorInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: VendorInviteRequest) => Promise<void>;
}

export function VendorInviteDialog({
  open,
  onOpenChange,
  onSubmit,
}: VendorInviteDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      role: "vendor",
    },
  });

  const handleSubmit = async (data: InviteFormData) => {
    setLoading(true);
    try {
      // Prepare invitation data
      const inviteData: VendorInviteRequest = {
        email: data.email,
        name: data.name,
        phone: data.phone
      };
      
      // Call the vendor service directly or use the provided onSubmit callback
      if (onSubmit) {
        await onSubmit(inviteData);
      } else {
        const response = await vendorService.inviteVendor(inviteData);
        
        if (!response.success) {
          throw new Error(response.message);
        }
      }
      
      toast.success("Vendor invitation sent successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Invitation error:", error);
      toast.error(error.message || "Failed to send vendor invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.store className="h-5 w-5" />
            Invite New Vendor
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new vendor to join the platform. They will
            receive an email with setup instructions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter vendor name"
                      className="transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                      className="transition-colors"
                    />
                  </FormControl>
                  <FormDescription>
                    This email will be used for login and notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter phone number"
                      className="transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
