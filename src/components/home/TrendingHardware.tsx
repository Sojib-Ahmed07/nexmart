import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Store } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: any; // Safely parsing your PostgreSQL Decimal field string representation
  stock: number;
  store: {
    name: string;
  };
}

interface TrendingHardwareProps {
  products: Product[];
}

export default function TrendingHardware({ products }: TrendingHardwareProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map((product) => {
          // Parse decimal reliably to prevent conversion exceptions down-line
          const parsedPrice = Number(product.price) || 0;
          const isLowStock = product.stock > 0 && product.stock <= 5;
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100/80 dark:border-gray-800/60 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all duration-500 ease-out flex flex-col overflow-hidden"
            >

              {/* BRANDING GRAPHICS IMAGE PORTAL FRAME */}
              <div className="p-4 bg-gradient-to-b from-gray-50 to-gray-50/30 dark:from-gray-950/40 dark:to-transparent aspect-square flex items-center justify-center relative overflow-hidden border-b border-gray-50 dark:border-gray-800/40">

                {/* Product Image Asset */}
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-h-48 w-auto object-contain dark:brightness-95 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500 ease-out select-none pointer-events-none z-10"
                  />
                )}

                {/* DYNAMIC METRIC STOCK BADGES */}
                {isOutOfStock && (
                  <span className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-lg bg-gray-900/90 text-white dark:bg-gray-800/90 text-[9px] font-black uppercase tracking-widest font-mono shadow-sm">
                    Sold Out
                  </span>
                )}

                {isLowStock && (
                  <span className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest font-mono border border-rose-100 dark:border-rose-900/30 shadow-sm animate-pulse">
                    Only {product.stock} Left
                  </span>
                )}
              </div>

              {/* DETAILS METADATA FOOTPRINT */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-5 relative z-10">
                <div className="space-y-2">

                  {/* Store Platform Node Owner */}
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                    <Store size={12} className="shrink-0" />
                    <span className="text-[10px] font-black font-mono uppercase tracking-wider truncate max-w-[180px]">
                      {product.store.name}
                    </span>
                  </div>

                  {/* Product Display Title Label */}
                  <h4 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-base tracking-tight leading-snug">
                    {product.name}
                  </h4>
                </div>

                {/* PRICING AND CONVERSION TRIGGERS FOOTER */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800/50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 font-mono">Price</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white font-mono tracking-tight">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parsedPrice)}
                    </span>
                  </div>

                  {/* Micro-animated Call-To-Action Element Box */}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group/btn h-11 w-11 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-all duration-300 flex items-center justify-center border border-gray-100 dark:border-gray-700/50 shadow-sm shrink-0"
                    aria-label={`View details for ${product.name}`}
                  >
                    <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
