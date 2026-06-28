import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface MerchantSpotlightProps {
  stores: Store[];
}

export default function MerchantSpotlight({ stores }: MerchantSpotlightProps) {
  if (!stores || stores.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {stores.map((store) => {
          // Generate a premium fallback avatar design using the vendor store's initial letter
          const storeLetter = store.name?.charAt(0).toUpperCase() || 'S';

          return (
            <div
              key={store.id}
              className="group relative p-6 rounded-[2rem] border border-gray-100/80 dark:border-gray-800/60 bg-white dark:bg-gray-900 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all duration-500 ease-out flex flex-col justify-between overflow-hidden"
            >
              {/* Decorative Subtle Radial Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-5 relative z-10">

                {/* BRAND AVATAR CRADLE ROW */}
                <div className="flex items-center justify-between w-full">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 dark:border-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {storeLetter}
                  </div>

                  {/* Verified Partner Stamp Accent */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/20 text-[10px] font-black tracking-wider uppercase text-emerald-700 dark:text-emerald-400 shadow-sm">
                    <CheckCircle2 size={12} strokeWidth={2.5} className="shrink-0 text-emerald-500" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* NAME & SLUG TITLE LABELS */}
                <div className="space-y-0.5">
                  <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {store.name}
                  </h4>
                  <span className="text-[10px] font-black uppercase font-mono tracking-wider text-gray-400/80 dark:text-gray-500 block">
                    /store/{store.slug}
                  </span>
                </div>
              </div>

              {/* ACTION ANCHOR FOOTER CONTAINER */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between relative z-10">

                {/* Count Inventory Analytics Indicator */}
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <ShoppingBag size={13} className="text-gray-400" />
                  <span className="text-xs font-bold font-mono">
                    {store._count.products} {store._count.products === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Micro-animated Primary Direction Arrow Action */}
                <Link
                  href={`/store/${store.slug}`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gray-50 hover:bg-indigo-600 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white transition-all duration-300 border border-gray-100 dark:border-gray-700/40 shadow-sm"
                  aria-label={`Visit ${store.name}`}
                >
                  <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
