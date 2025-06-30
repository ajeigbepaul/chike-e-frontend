"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";


function VerifySuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // Show success message and handle redirect
  useEffect(() => {
    // Show success message
    // toast.success("Email verified successfully! Please log in.");

    // Automatically redirect to login after countdown
    if (countdown <= 0) {
      router.push("/auth/signin?verified=true");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Check if we have a redirect URL
  useEffect(() => {
    const redirectUrl = searchParams.get("callbackUrl");
    if (redirectUrl && redirectUrl !== "/auth/signin") {
      // If we have a valid redirect URL, use it instead of the default login
      setTimeout(() => {
        router.push(redirectUrl);
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Email Verified Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Your email has been verified. You can now log in to your account.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Redirecting to login in {countdown} seconds...
        </p>
        <Link
          href="/auth/signin?verified=true"
          className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Go to Login Now
        </Link>
      </div>
    </div>
  );

}

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>}>
      <VerifySuccessContent />
    </Suspense>
  );
}