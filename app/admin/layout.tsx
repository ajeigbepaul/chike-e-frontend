"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If session is loaded and user is not admin, redirect to unauthorized
    if (status === "authenticated" && session?.user?.role !== "admin") {
      const timer = setTimeout(() => {
        router.push("/unauthorized");
      }, 100);
      return () => clearTimeout(timer);
    }

    // If session is loaded and user is admin but we're not on an admin route, redirect to admin dashboard
    if (status === "authenticated" && session?.user?.role === "admin") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/admin")) {
        const timer = setTimeout(() => {
          router.push("/admin/dashboard");
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [session, status, router]);

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading (middleware should handle redirect)
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If authenticated but not admin, redirect to unauthorized
  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
