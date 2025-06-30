"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services";
import { toast } from "react-hot-toast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      // Try to get token from different possible locations
      const token = 
        searchParams.get("token") || 
        searchParams.get("t") || 
        window.location.pathname.split("/verify-email/")[1];
      
      // Get callback URL if present
      const callbackUrl = searchParams.get("callbackUrl") || "/auth/verify-success";
      
      console.log("Verification params:", { token: token?.substring(0, 10) + "...", callbackUrl });
      
      if (!token) {
        console.error("Verification token is missing");
        setError("Verification token is missing. Please check your email link.");
        setIsVerifying(false);
        return;
      }

      try {
        // Use the new handleVerificationRedirect method that handles both verification and redirect
        if (typeof authService.handleVerificationRedirect === 'function') {
          // Use the new method if available
          const result = await authService.handleVerificationRedirect(token, callbackUrl);
          
          // The handleVerificationRedirect method will redirect automatically on success
          if (!result.success) {
            setError(result.error || "Failed to verify email");
            setIsVerifying(false);
          }
        } else {
          // Fallback to original implementation
          const result = await authService.verifyEmail(token);
          
          if (result.success) {
            toast.success("Email verified successfully!");
            
            // Add a short delay before redirecting to ensure the toast is visible
            setTimeout(() => {
              router.push(callbackUrl || "/auth/verify-success");
            }, 1500);
          } else {
            setError(result.error || "Failed to verify email");
            setIsVerifying(false);
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("An error occurred during verification. Please try again or contact support.");
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function VerifyEmailFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <p className="text-gray-600">
          Please wait while we load the verification page...
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

