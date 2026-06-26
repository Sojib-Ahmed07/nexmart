import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  ShoppingBag,
  Settings,
  Package,
  LayoutDashboard,
  Store,
  Users,
  Layers,
  LogOut
} from 'lucide-react';

// 1. Explicitly type our route objects to prevent index errors
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect('/login');
  }

  // 2. Cast the incoming string safely to your system's supported type union
  const role = session.user.role as 'USER' | 'SELLER' | 'ADMIN';

  // 3. Bind the index signature tightly to our allowed roles
  const routes: Record<'USER' | 'SELLER' | 'ADMIN', NavigationItem[]> = {
    USER: [
      { label: 'Overview', href: '/dashboard/user', icon: LayoutDashboard },
      { label: 'My Orders', href: '/dashboard/user/orders', icon: Package },
      { label: 'Settings', href: '/dashboard/user/settings', icon: Settings },
    ],
    SELLER: [
      { label: 'Store Overview', href: '/dashboard/seller', icon: Store },
      { label: 'My Products', href: '/dashboard/seller/products', icon: ShoppingBag },
      { label: 'Orders Received', href: '/dashboard/seller/orders', icon: Package },
    ],
    ADMIN: [
      { label: 'Master Console', href: '/dashboard/admin', icon: LayoutDashboard },
      { label: 'Manage Stores', href: '/dashboard/admin/stores', icon: Store },
      { label: 'Global Categories', href: '/dashboard/admin/categories', icon: Layers },
      { label: 'Platform Users', href: '/dashboard/admin/users', icon: Users },
    ]
  };

  const activeMenu = routes[role] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {session.user.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {role} Account
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {activeMenu.map((item: NavigationItem, index: number) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 font-medium text-sm transition-colors group"
                >
                  <Icon className="h-4 w-4 group-hover:text-indigo-600 transition-colors" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
