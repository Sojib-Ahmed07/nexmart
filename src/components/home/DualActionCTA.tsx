import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface DualActionCTAProps {
  isAuthenticated: boolean;
  userRole?: string;
}

export default function DualActionCTA({ isAuthenticated, userRole }: DualActionCTAProps) {
  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">

      {/* ACCESS ROUTE 1: GLOBAL CATALOG EXCHANGE */}
      <div className="p-8 sm:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/20 dark:via-gray-900/40 dark:to-gray-950/20 flex flex-col justify-between items-start gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block">System Node /01</span>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">/shop</h3>
        </div>
        <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity">
          <ShoppingBag size={14} />
        </Link>
      </div>

      {/* ACCESS ROUTE 2: TENANT HANDSHAKE ENGINE */}
      <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-50/20 via-white to-gray-50 dark:from-indigo-950/10 dark:via-gray-900/40 dark:to-gray-950/20 flex flex-col justify-between items-start gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block">System Node /02</span>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            {isAuthenticated ? `/dashboard/${userRole?.toLowerCase()}` : "/login"}
          </h3>
        </div>
        <Link
          href={isAuthenticated ? `/dashboard/${userRole?.toLowerCase()}` : "/login"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
