import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

interface DualActionCTAProps {
  isAuthenticated: boolean;
  userRole?: 'USER' | 'SELLER' | 'ADMIN';
  isStoreApproved?: boolean; // Pass down the direct DB storefront validation check status
}

export default function DualActionCTA({
  isAuthenticated,
  userRole = 'USER',
  isStoreApproved = false
}: DualActionCTAProps) {

  // Deterministically compute the workspace path target
  let dashboardHref = '/login';
  let secondaryHeading = 'Launch Marketplace Node';
  let secondaryDesc = 'Create a customer profile to access deep search tools, active tracking, and invoice management systems.';

  if (isAuthenticated) {
    if (userRole === 'ADMIN') {
      dashboardHref = '/dashboard/admin';
      secondaryHeading = 'Admin Management Console';
      secondaryDesc = 'Access core management systems, approve active vendor entries, and handle categorical variables.';
    } else if (userRole === 'SELLER' && isStoreApproved) {
      dashboardHref = '/dashboard/seller';
      secondaryHeading = 'Vendor Merchant Studio';
      secondaryDesc = 'Review received transactions, adjust stock parameters, and control real-time production displays.';
    } else {
      dashboardHref = '/dashboard/user';
      secondaryHeading = 'Personal Customer Space';
      secondaryDesc = 'Track active purchases, review history statements, or request verified storefront elevation access.';
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-[2.5rem] border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-gray-900">

        {/* ACCESS ROUTE 1: GLOBAL CATALOG EXCHANGE */}
        <div className="group relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/20 dark:from-gray-900/40 dark:via-gray-900/10 dark:to-gray-950/20 flex flex-col justify-between gap-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black font-mono tracking-widest uppercase text-gray-400">System Hub /01</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Explore Supercharged Catalog
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm">
              Browse hardware assets, sort by high-performance index categories, and process immediate orders securely.
            </p>
          </div>

          <Link
            href="/shop"
            className="group/btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-900 hover:bg-indigo-600 dark:bg-white dark:hover:bg-indigo-500 text-white dark:text-gray-950 dark:hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md self-start relative z-10"
          >
            <ShoppingBag size={14} /> Enter Showcase
            <ArrowUpRight size={14} className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* ACCESS ROUTE 2: TENANT HANDSHAKE ENGINE */}
        <div className="group relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-indigo-50/10 via-white to-gray-50/10 dark:from-indigo-950/10 dark:via-gray-900/10 dark:to-gray-950/20 flex flex-col justify-between gap-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black font-mono tracking-widest uppercase text-gray-400">System Hub /02</span>
              <Sparkles size={12} className="text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {secondaryHeading}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm">
              {secondaryDesc}
            </p>
          </div>

          <Link
            href={dashboardHref}
            className="group/btn inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 self-start relative z-10"
          >
            {userRole === 'SELLER' && isStoreApproved ? <Store size={14} /> : <ArrowRight size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />}
            {isAuthenticated ? "Launch Dashboard" : "Authenticate Identity"}
          </Link>
        </div>

      </div>
    </div>
  );
}
