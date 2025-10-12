"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/account/AccountSideNav";
import { cn } from "@/lib/utils";

interface AccountMobileNavProps {
  className?: string;
}

export default function AccountMobileNav({ className }: AccountMobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className={cn("md:hidden", className)}>
      <button
        aria-expanded={open}
        aria-controls="account-mobile-nav"
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
        onClick={toggleMenu}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Account Menu
      </button>
      {open && (
        <nav
          id="account-mobile-nav"
          className="mt-3 space-y-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-md"
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/account" && pathname === "/account");
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-yellow text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
