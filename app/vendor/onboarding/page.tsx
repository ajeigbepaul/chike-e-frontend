"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Eye, EyeOff, LockKeyhole, MapPin, Phone } from "lucide-react";

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

function VendorOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [directOnboarding, setDirectOnboarding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (token) {
      // Invitation flow
      setDirectOnboarding(false);
      const verifyInvitation = async () => {
        setIsVerifying(true);
        try {
          const response = await vendorService.verifyInvitation(token);
          if (!response.success) {
            throw new Error(
              response.message || "Invalid or expired invitation"
            );
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
    } else {
      // Direct onboarding flow
      setDirectOnboarding(true);
      setIsVerifying(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (directOnboarding && sessionStatus !== "loading" && !session) {
      // Not authenticated, redirect to sign in with callback
      router.push("/auth/signin?callbackUrl=/vendor/onboarding");
    }
  }, [directOnboarding, session, sessionStatus, router]);

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      setIsLoading(true);
      const token = searchParams.get("token");
      let response;
      if (token) {
        // Invitation onboarding
        const onboardingData: VendorOnboardingRequest = {
          token,
          password: data.password,
          phone: data.phone,
          address: data.address,
          bio: data.bio,
        };
        response = await vendorService.completeOnboarding(onboardingData);
      } else {
        // Direct onboarding (no token)
        if (!session?.user) {
          throw new Error("You must be signed in to onboard as a vendor.");
        }
        // You may need to adjust this API call to match your backend
        response = await vendorService.directOnboarding({
          userId: session.user.id,
          password: data.password,
          phone: data.phone,
          address: data.address,
          bio: data.bio,
        });
      }
      if (!response.success) {
        throw new Error(response.message || "Failed to complete onboarding");
      }
      toast.success("Registration completed successfully");
      router.push("/auth/signin");
    } catch (error: any) {
      console.error("Error completing vendor onboarding:", error);
      toast.error(error.message || "Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying || (directOnboarding && sessionStatus === "loading")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!directOnboarding && !invitation) {
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

  // Welcome message
  let welcomeName = "";
  if (invitation?.name) {
    welcomeName = invitation.name;
  } else if (session?.user?.name) {
    welcomeName = session.user.name;
  } else if (session?.user?.email) {
    welcomeName = session.user.email;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#fffaf0] via-white to-[#f7f8fa] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
            Vendor onboarding
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Your Registration
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
            Welcome, {welcomeName}! Please complete your vendor profile.
          </p>
        </div>
        <Card className="overflow-hidden border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/50 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="h-11 pl-10 pr-11"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((visible) => !visible)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
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
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="h-11 pl-10 pr-11"
                          {...field}
                        />
                        <button
                          type="button"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          onClick={() => setShowConfirmPassword((visible) => !visible)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
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
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input className="h-11 pl-10" {...field} />
                      </div>
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
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea className="min-h-24 pl-10" {...field} />
                      </div>
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
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-11 w-full bg-brand-yellow font-semibold text-gray-900 shadow-sm hover:bg-brand-yellow/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    {/* <Spinner className="mr-2 h-2 w-2" /> */}
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

export default function VendorOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          Loading...
        </div>
      }
    >
      <VendorOnboardingContent />
    </Suspense>
  );
}
