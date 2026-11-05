// frontend/components/account/AccountSideNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Mail, FileText, Heart, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import notificationService from "@/services/api/notification";
import { useSession } from "next-auth/react";

export const navItems = [
  {
    label: "My Account",
    href: "/account",
    key: "account",
    icon: <User className="w-6 h-6 mr-2" />,
  },
  {
    label: "Orders",
    href: "/account/orders",
    key: "orders",
    icon: <ShoppingBag className="w-6 h-6 mr-2" />,
  },
  {
    label: "Inbox",
    href: "/account/inbox",
    key: "inbox",
    icon: <Mail className="w-6 h-6 mr-2" />,
  },
  {
    label: "Pending Reviews",
    href: "/account/reviews",
    key: "reviews",
    icon: <FileText className="w-6 h-6 mr-2" />,
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    key: "wishlist",
    icon: <Heart className="w-6 h-6 mr-2" />,
  },
  {
    label: "Quotes",
    href: "/account/quote",
    key: "quotes",
    icon: <FileText className="w-6 h-6 mr-2" />,
  },
];

export default function AccountSideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: inboxCount = 0 } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () => notificationService.getUnreadCount("order"),
    enabled: !!session,
    refetchInterval: 30000,
  });
  const { data: quoteCount = 0 } = useQuery({
    queryKey: ["unread-quote-notifications"],
    queryFn: () => notificationService.getUnreadByType("quote"),
    enabled: !!session,
    refetchInterval: 30000,
  });
  return (
    <aside
      className="sticky top-20 hidden w-64 flex-shrink-0 bg-[#1F201D] border rounded-xl min-h-[calc(100vh-6rem)] py-4 px-0 mr-6 z-30 shadow md:block"
      role="navigation"
      aria-label="Account sections"
    >
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/account" && pathname === "/account");
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center rounded-none px-6 py-3 text-sm font-medium transition border-l-4 ${
                isActive
                  ? "text-brand-yellow  border-brand-yellow"
                  : "border-transparent text-gray-400 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="flex items-center gap-2">
                {item.label}
                {item.key === "inbox" && inboxCount > 0 && (
                  <span className="inline-flex min-w-5 animate-pulse items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                    {inboxCount}
                  </span>
                )}
                {item.key === "quotes" && quoteCount > 0 && (
                  <span className="inline-flex min-w-5 animate-pulse items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                    {quoteCount}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
