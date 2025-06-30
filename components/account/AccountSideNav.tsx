// frontend/components/account/AccountSideNav.tsx
"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Mail, FileText,  Heart, User } from 'lucide-react';

const navItems = [
  { label: 'My Account', href: '/account', key: 'account', icon: <User className="w-6 h-6 mr-2" /> },
  { label: 'Orders', href: '/account/orders', key: 'orders', icon: <ShoppingBag className="w-6 h-6 mr-2" /> },
  { label: 'Inbox', href: '/account/inbox', key: 'inbox', icon: <Mail className="w-6 h-6 mr-2" /> },
  { label: 'Pending Reviews', href: '/account/reviews', key: 'reviews', icon: <FileText className="w-6 h-6 mr-2" /> },
  { label: 'Wishlist', href: '/account/wishlist', key: 'wishlist', icon: <Heart className="w-6 h-6 mr-2" /> },
];

export default function AccountSideNav() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 w-64 bg-[#1F201D] border rounded-xl min-h-[calc(100vh-6rem)] py-4 px-0 mr-6 z-30 shadow">
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href === '/account' && pathname === '/account');
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center rounded-none px-6 py-3 text-sm font-medium transition border-l-4 ${
                isActive ? 'text-brand-yellow  border-brand-yellow' : 'border-transparent text-gray-400 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}