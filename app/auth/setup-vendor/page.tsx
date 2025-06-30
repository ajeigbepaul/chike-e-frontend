"use client";

import { useState,Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";


function VendorOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Invalid setup link");
        router.push("/auth/signin");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await authService.setupVendor(token, {
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
      });

      if (response.status === "success") {
        toast.success("Vendor setup completed successfully!");
        router.push("/auth/signin");
      } else {
        toast.error(response.message || "Setup failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Icons.store className="h-12 w-12 mx-auto text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Complete Your Vendor Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please fill in your details to complete the setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className={cn(
                    "transition-colors",
                    formData.password && "border-green-500 focus:ring-green-500"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className={cn(
                    "transition-colors",
                    formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                      ? "border-green-500 focus:ring-green-500"
                      : formData.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className={cn(
                  "transition-colors",
                  formData.phone && "border-green-500 focus:ring-green-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                className={cn(
                  "transition-colors",
                  formData.address && "border-green-500 focus:ring-green-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                placeholder="Tell us about yourself and your business"
                rows={4}
                className={cn(
                  "transition-colors resize-none",
                  formData.bio && "border-green-500 focus:ring-green-500"
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Completing Setup...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );

}

export default function VendorSetupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>}>
      <VendorOnboardingContent />
    </Suspense>
  );
}