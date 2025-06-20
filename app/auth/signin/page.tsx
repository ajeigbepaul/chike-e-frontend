// src/app/auth/signin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");
    const registered = searchParams.get("registered");

    if (verified === "true") {
      toast.success("Email verified successfully! Please log in.");
    }
    if (error === "invalid_token") {
      toast.error(
        "Invalid or expired verification link. Please try registering again."
      );
    }
    if (registered === "true") {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        // Update the session to get the latest data
        await update();

        // Get the updated session with the user role
        const updatedSession = await fetch("/api/auth/session").then((res) =>
          res.json()
        );

        toast.success("Logged in successfully!");

        switch (updatedSession?.user?.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "vendor":
            router.push("/vendor/dashboard");
            break;
          default:
            router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="text-right mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-brand-yellow hover:text-yellow-600"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-yellow text-white py-2 rounded hover:bg-yellow-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-brand-yellow hover:text-yellow-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
