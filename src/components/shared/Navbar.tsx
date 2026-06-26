'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShoppingBag, Search, Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
// 1. Import your custom dynamic memory state hook 🚀
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  // 2. Consume your live real-time cart tracker variables
  const { cartCount } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          setIsOpen(false);
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  if (!mounted) {
    return <div className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50" />;
  }

  const isDark = theme === 'dark';
  const user = session?.user;
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <nav className="w-full border-b sticky top-0 z-50 transition-colors duration-200 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tight">
              nex<span className="text-indigo-600 dark:text-indigo-400">mart</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/shop" className="hover:text-indigo-500 transition-colors">
              All Products
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products or shops..."
                className="w-full rounded-lg border py-2 pl-4 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/cart" className="p-2 relative transition-colors" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {/* 3. Swap the static 0 placeholder with your dynamic live cart counts! 🎯 */}
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center transition-scale duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Auth State Conditional Layout */}
            {isPending ? (
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : user ? (
              /* Profile Dropdown Container */
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

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-lg py-1.5 text-sm z-50">
                    <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-4 w-4" /> My Profile
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Gate Buttons */
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link href="/cart" className="p-2 relative text-gray-600 dark:text-gray-300" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {/* 4. Update the mobile layout indicator as well! */}
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden border-t px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full left-0 top-16 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 z-50">
          {/* Mobile Search */}
          <div className="relative w-full pt-2">
            <input
              type="text"
              placeholder="Search products or shops..."
              className="w-full rounded-lg border py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pt-2 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
          </div>

          {/* Mobile Core Links */}
          <div className="flex flex-col space-y-3 font-medium text-gray-600 dark:text-gray-300">
            <Link href="/products" onClick={() => setIsOpen(false)} className="py-2 hover:text-indigo-500">
              All Products
            </Link>
            <Link href="/shops" onClick={() => setIsOpen(false)} className="py-2 hover:text-indigo-500">
              Shops
            </Link>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Mobile Conditional User Panel */}
          <div className="pt-2">
            {isPending ? (
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 overflow-hidden flex items-center justify-center">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{userInitials}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 py-2 px-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2.5 w-full text-left py-2 px-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-medium py-2.5 rounded-lg border transition-colors border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-medium text-white bg-indigo-600 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
