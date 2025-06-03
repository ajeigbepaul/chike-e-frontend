"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        toast({
          title: "Verification successful",
          description: "Please complete your vendor profile setup",
        });

        // Redirect to vendor setup page
        router.push(`/auth/setup-vendor?token=${token}`);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Verification failed",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Verifying your invitation...
            </h1>
            <p className="text-gray-500">
              Please wait while we verify your vendor invitation.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
