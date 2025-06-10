"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronUp,
  Tag,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  subItems?: {
    name: string;
    href: string;
  }[];
};

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <Layers className="h-5 w-5" />,
      subItems: [
        { name: "All Categories", href: "/admin/categories" },
        { name: "Add New", href: "/admin/categories/new" },
      ],
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
      subItems: [
        { name: "All Products", href: "/admin/products" },
        { name: "Add New", href: "/admin/products/new" },
        { name: "Import/Export", href: "/admin/products/import-export" },
      ],
    },
    {
      name: "Promotions",
      href: "/admin/promotions",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      subItems: [
        { name: "All Orders", href: "/admin/orders" },
        { name: "Pending", href: "/admin/orders?status=pending" },
        { name: "Completed", href: "/admin/orders?status=completed" },
      ],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      subItems: [
        { name: "All Users", href: "/admin/users" },
        { name: "Admins", href: "/admin/users?role=admin" },
        { name: "Customers", href: "/admin/users?role=customer" },
      ],
    },
    {
      name: "Vendors",
      href: "/admin/vendors",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <BarChart2 className="h-5 w-5" />,
      subItems: [
        { name: "Sales", href: "/admin/reports/sales" },
        { name: "Products", href: "/admin/reports/products" },
      ],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActive = (href: string, subItems?: { href: string }[]) => {
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some((item) => pathname === item.href);
    }
    return false;
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col h-full px-3 py-4 border-r bg-white">
        <div className="mb-10 px-4 py-2">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer",
                    isActive(item.href, item.subItems)
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => toggleSubmenu(item.name)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        isActive(item.href, item.subItems)
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-500">
                    {openSubmenus[item.name] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg",
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        isActive(item.href) ? "text-blue-600" : "text-gray-500"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              )}

              {item.subItems && openSubmenus[item.name] && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "block px-4 py-2 text-sm rounded-lg",
                        pathname === subItem.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
