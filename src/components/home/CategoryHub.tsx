import React from 'react';
import Link from 'next/link';
import prisma from "@/lib/prisma";
import { LayoutGrid, ArrowUpRight } from 'lucide-react';

export default async function CategoryHub() {
  // Fetch real category records and aggregate the active product count per category
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  if (!categories || categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-gray-400 font-medium">
        No active categories found in database.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative p-6 rounded-[2rem] border border-gray-100/80 dark:border-gray-800/60 bg-gradient-to-b from-gray-50/60 to-gray-50/10 dark:from-gray-900/40 dark:to-gray-900/10 hover:bg-white dark:hover:bg-gray-900 hover:border-indigo-500/60 dark:hover:border-indigo-500/50 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.08)] transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left gap-5 overflow-hidden"
          >
            {/* Premium Glow Aura Effect Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* UNIFIED DYNAMIC ICON CASE */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 dark:border-gray-700/50 transform group-hover:scale-110 group-hover:rotate-3">
              <LayoutGrid className="h-5 w-5" strokeWidth={2} />
            </div>

            {/* DYNAMIC STRINGS FROM THE DB SCHEMA */}
            <div className="space-y-1 w-full">
              <h4 className="font-black text-sm tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-center md:justify-between w-full">
                <span>{cat.name}</span>
                <ArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 hidden md:block shrink-0 text-indigo-500" />
              </h4>

              {/* Live inventory aggregation indicator */}
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-gray-400/80 dark:text-gray-500 block">
                {cat._count.products} {cat._count.products === 1 ? 'Product' : 'Products'} Available
              </span>
            </div>
          </Link>
        ))}

        {/* UNIVERSAL BROWSE ALL CTA PLUG */}
        <Link
          href="/shop"
          className="group relative p-6 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500/40 bg-transparent flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 col-span-2 md:col-span-1"
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 transition-colors">
            <LayoutGrid size={18} />
          </div>
          <div>
            <p className="font-bold text-xs text-gray-800 dark:text-gray-200">Browse All Hubs</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Explore entire catalog</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
