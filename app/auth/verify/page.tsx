"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Invalid verification link");
        router.push("/auth/signin");
        return;
      }

      try {
        const response = await authService.verifyVendorInvitation(token);

        if (response.success) {
          toast.success("Email verified successfully!");
          router.push("/auth/setup-vendor");
        } else {
          toast.error(response.message || "Verification failed");
          router.push("/auth/signin");
        }
      } catch (error: any) {
        toast.error(error.message || "Verification failed");
        router.push("/auth/signin");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
        {verifying ? (
          <p className="text-gray-600">
            Please wait while we verify your email...
          </p>
        ) : (
          <p className="text-gray-600">Redirecting you to the login page...</p>
        )}
      </div>
    </div>
  );
}
