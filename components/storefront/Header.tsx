"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, ChevronDown, ChevronRight, LogOut, Settings, Upload, Bell, LogIn, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart, clearCart } from '@/store/cartSlice';
import { DropdownMenu } from './DropdownMenu';
import { SearchSuggestions } from './SearchSuggestions';
import { CategoryDropdown } from './CategoryDropdown';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/api/category';
import wishlistService from '@/services/api/wishlist';
import { Badge } from '@/components/ui/badge';
import notificationService from '@/services/api/notification';

export function Header() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  // Fetch wishlist using React Query for global sync
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
    enabled: !!session,
  });
  const wishlistCount = wishlistData?.data?.length || 0;

  // Fetch unread notifications count
  const { data: unreadCount } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: notificationService.getUnreadCount,
    enabled: !!session,
  });

  const handleSignOut = async () => {
    dispatch(clearCart());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    await signOut({ redirect: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src={logo} 
                width={120} 
                height={40}
                alt="Company Logo"
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link href="/" className={`${pathname === '/' ? 'text-brand-yellow' : 'text-gray-900'} hover:text-brand-yellow transition-colors`}>
                Home
              </Link>
              <Link href="/about" className={`${pathname === '/about' ? 'text-brand-yellow' : 'text-gray-900'} hover:text-brand-yellow transition-colors`}>
                About
              </Link>
              <CategoryDropdown
                categories={categories}
                isMobile={isMobile}
                setIsMobile={setIsMobile}
              />
              {/* <Link href="/contact" className="text-gray-900 hover:text-brand-yellow transition-colors">
                Contact
              </Link> */}
            </nav>
          </div>

          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent w-64"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {showSuggestions && searchQuery.length > 2 && (
                <SearchSuggestions 
                  query={searchQuery} 
                  onSelect={handleSuggestionSelect} 
                />
              )}
            </div>

            <button 
              className="p-2 text-gray-600 hover:text-brand-yellow transition-colors relative"
              onClick={() => router.push('/cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <DropdownMenu
              trigger={
                <button className="flex items-center space-x-1 p-2 text-gray-600 hover:text-brand-yellow transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">Account</span>
                </button>
              }
            >
              {/* Dropdown menu content */}
              {!session ? (
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10"
                  onClick={() => router.push('/auth/signin')}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </button>
              ) : (
                <>
                  <Link
                    href="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 relative"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <Badge variant="secondary" className="ml-2">{wishlistCount}</Badge>
                    )}
                  </Link>
                  <Link
                    href="/account/inbox"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 relative"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Inbox
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
                    )}
                  </Link>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              className="p-2 text-gray-600 hover:text-brand-yellow"
              onClick={() => router.push('/cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className="p-2 text-gray-600 hover:text-brand-yellow focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - Always visible */}
        <div className="md:hidden pb-3">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {showSuggestions && searchQuery.length > 2 && (
              <SearchSuggestions 
                query={searchQuery} 
                onSelect={handleSuggestionSelect} 
              />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white pb-4">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-4 py-2 ${pathname === '/' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`block px-4 py-2 ${pathname === '/about' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <CategoryDropdown
                categories={categories}
                isMobile={true}
                setIsMobile={setIsMobile}
                trigger={
                  <div className="px-4 flex items-center">Products</div>
                }
              />
              <Link
                href="/contact"
                className={`block px-4 py-2 ${pathname === '/contact' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              {!session ? (
                <button
                  className="w-full flex items-center px-4 py-2 text-gray-900 hover:bg-gray-100"
                  onClick={() => {
                    router.push('/auth/signin');
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </button>
              ) : (
                <>
                  <Link
                    href="/account"
                    className={`block px-4 py-2 ${pathname === '/account' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className={`block px-4 py-2 ${pathname === '/orders' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className={`block px-4 py-2 ${pathname === '/wishlist' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/inbox"
                    className={`block px-4 py-2 ${pathname === '/inbox' ? 'text-brand-yellow' : 'text-gray-900'} hover:bg-gray-100`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inbox
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2 text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}