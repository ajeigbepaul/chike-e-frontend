"use client"
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, ChevronDown, LogOut, Settings, User as UserIcon, Upload, Bell, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCart } from '@/store/cartSlice';
import { DropdownMenu } from './DropdownMenu';
import { SearchSuggestions } from './SearchSuggestions';
import { CategoryDropdown } from './CategoryDropdown';
import Image from 'next/image';
import logo from '@/public/logo.svg'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/api/category';

export function Header() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      if (!response.success) throw new Error(response.message);
      return response.data || [];
    },
  });

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // You would typically navigate to the product page or trigger search here
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <Image 
                src={logo} 
                width={100} 
                height={20}
                alt='logo'
                className="h-8 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-foreground hover:text-brand-yellow transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-foreground hover:text-brand-yellow transition-colors">
                About Us
              </Link>
              <CategoryDropdown
                categories={categories}
                trigger={null}
                // trigger={
                //   <div className="text-foreground hover:text-brand-yellow transition-colors cursor-pointer flex items-center space-x-1">
                //     <span>Products</span>
                //     <ChevronDown className="h-3 w-3" />
                //   </div>
                // }
              />
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block" ref={searchRef}>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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

            <div className="flex space-x-4">
              <button 
                className="p-2 text-gray-600 hover:text-brand-yellow transition-colors relative"
                onClick={() => dispatch(toggleCart())}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </button>
              
              <button 
                className="p-2 text-gray-600 hover:text-brand-yellow transition-colors relative"
                onClick={() => console.log('Upload clicked')}
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload</span>
              </button>
              
              <button 
                className="p-2 text-gray-600 hover:text-brand-yellow transition-colors relative"
                onClick={() => console.log('Notifications clicked')}
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </button>
              
              <DropdownMenu
                trigger={
                  <div
                    className="flex items-center space-x-1 p-2 text-gray-600 hover:text-brand-yellow transition-colors cursor-pointer border-1 border-gray-300 rounded-full px-4"
                    role="button"
                    tabIndex={0}
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                }
              >
                <div className="py-1">
                  {!session ? (
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow"
                      onClick={() => router.push('/auth/signin')}
                      type="button"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow"
                        role="menuitem"
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        href="/account/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow"
                        role="menuitem"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-brand-yellow/10 hover:text-brand-yellow"
                        onClick={handleSignOut}
                        type="button"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 sm:hidden relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </header>
  );
}