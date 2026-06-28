'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShoppingBag, Search, Menu, X, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useCart } from '@/context/CartContext';

interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: 'USER' | 'SELLER' | 'ADMIN';
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const { cartCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Local input string state tracking structure
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read context parameter alignments
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronized state processor logic loop
  const handleSearchUpdate = (value: string) => {
    setSearchQuery(value);
    const currentParams = new URLSearchParams(window.location.search);

    if (value) {
      currentParams.set('search', value);
    } else {
      currentParams.delete('search');
    }

    if (pathname === '/shop') {
      // Keeps filtering fluid and instant in memory
      router.replace(`/shop?${currentParams.toString()}`, { scroll: false });
    } else {
      // Route routing navigation processing fallback
      router.push(`/shop?${currentParams.toString()}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50" />;
  }

  const isDark = theme === 'dark';
  const user = session?.user as BetterAuthUser | undefined;
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const getDashboardHref = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin';
    if (user?.role === 'SELLER') return '/dashboard/seller';
    return '/dashboard/user';
  };

  return (
    <nav className="w-full border-b sticky top-0 z-50 transition-colors duration-200 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo Frame */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tight">
              nex<span className="text-indigo-600 dark:text-indigo-400">mart</span>
            </Link>
          </div>

          {/* Links config */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/shop" className="hover:text-indigo-500 transition-colors">
              All Products
            </Link>
          </div>

          {/* Core Search input component container */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchUpdate(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border py-2 pl-4 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Desktop interface nodes actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/cart" className="p-2 relative transition-colors text-gray-600 dark:text-gray-300 hover:text-indigo-500">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 overflow-hidden cursor-pointer focus:outline-none"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{userInitials}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-lg py-1.5 text-sm z-50">
                    <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardHref()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-indigo-500" /> Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              setDropdownOpen(false);
                              setIsOpen(false);
                              router.push('/login');
                              router.refresh();
                            },
                          },
                        });
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer font-medium"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Element Layout */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/cart" className="p-2 relative text-gray-600 dark:text-gray-300">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Input Drawer Panel */}
      {isOpen && (
        <div className="md:hidden border-t px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full left-0 top-16 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 z-50">
          <div className="relative w-full pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchUpdate(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pt-2 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
          </div>

          <div className="flex flex-col space-y-1 font-medium text-gray-600 dark:text-gray-300">
            <Link href="/shop" onClick={() => setIsOpen(false)} className="py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-500 transition-colors">
              All Products
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
