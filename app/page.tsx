"use client";

import Spinner from "@/components/Spinner";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  if (status === "loading") {
    return (
     <Spinner/>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to the Market place</h1>
          <div className="flex space-x-4">
            {session ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        <p className="text-lg mb-4">
          This is a market place for buying and selling products.
        </p>
        {session && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {session.user?.name}!
            </h2>
            <p className="text-gray-600">
              You are logged in as {session.user?.email}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
