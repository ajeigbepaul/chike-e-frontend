"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function VendorHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/vendor/dashboard" className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={120} height={40} priority />
        </Link>
        {/* Account Dropdown */}
        {session && (
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
              <LogOut className="h-5 w-5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
