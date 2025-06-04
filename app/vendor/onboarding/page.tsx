"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import vendorService, { VendorOnboardingRequest } from "@/services/api/vendor";
import Spinner from "@/components/Spinner";

const onboardingSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    bio: z.string().min(1, "Bio is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function VendorOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Verify invitation token
    const verifyInvitation = async () => {
      setIsVerifying(true);
      try {
        const response = await vendorService.verifyInvitation(token);

        if (!response.success) {
          throw new Error(response.message || "Invalid or expired invitation");
        }

        setInvitation(response.data);
      } catch (error: any) {
        console.error("Error verifying invitation:", error);
        toast.error(error.message || "Invalid or expired invitation");
        router.push("/");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyInvitation();
  }, [searchParams, router]);

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      setIsLoading(true);

      const token = searchParams.get("token");
      if (!token) {
        throw new Error("Invitation token is missing");
      }

      const onboardingData: VendorOnboardingRequest = {
        token,
        password: data.password,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
      };

      const response = await vendorService.completeOnboarding(onboardingData);

      if (!response.success) {
        throw new Error(response.message || "Failed to complete onboarding");
      }

      toast.success("Registration completed successfully");
      router.push("/vendor/dashboard");
    } catch (error: any) {
      console.error("Error completing vendor onboarding:", error);
      toast.error(error.message || "Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Invitation Error
            </h2>
            <p>The invitation is invalid or has expired.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {invitation.name}! Please complete your vendor profile.
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Completing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
