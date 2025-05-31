"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V9m0 0V7m0 2h2m-2 0H9m9 3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don&apos;t have permission to access this page. This area
          requires elevated privileges.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
          {session?.user?.role && (
            <div className="text-sm text-gray-500 mt-4">
              <p>
                Your current role: <span className="font-medium capitalize">{session.user.role}</span>
              </p>
              <p className="mt-1">
                This page requires higher privileges than your current role.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
