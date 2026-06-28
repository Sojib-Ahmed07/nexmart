'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Layers, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: any;
  images: string[];
  store: { name: string };
  category: { name: string; slug: string };
}

interface ClientShopGridProps {
  initialProducts: Product[];
  targetCategorySlug?: string;
}

export default function ClientShopGrid({ initialProducts, targetCategorySlug }: ClientShopGridProps) {
  const searchParams = useSearchParams();
  const activeSearchQuery = searchParams.get('search') || '';

  // Lightning fast client-side calculation array filter processing
  const filteredProducts = initialProducts.filter((product) => {
    if (!activeSearchQuery) return true;

    const query = activeSearchQuery.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(query) ||
      product.store.name.toLowerCase().includes(query) ||
      (product.category?.name && product.category.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Status Badges */}
      {(targetCategorySlug || activeSearchQuery) && (
        <div className="flex flex-wrap gap-2">
          {targetCategorySlug && filteredProducts.length > 0 && (
            <p className="text-xs font-mono inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-1 rounded-md font-bold">
              <Layers size={12} /> Active Category: {filteredProducts[0].category.name}
            </p>
          )}

          {activeSearchQuery && (
            <div className="text-xs font-mono inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-1 rounded-md font-bold">
              Matches for: "{activeSearchQuery}"
              <Link href="/shop" className="hover:text-red-500 transition-colors">
                <X size={12} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Grid Render Output */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 text-sm max-w-md mx-auto space-y-2">
          <ShoppingBag className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-700" />
          <p className="font-semibold">No products found.</p>
          <p className="text-xs text-gray-500">No active inventory matching "{activeSearchQuery}" was found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md overflow-hidden transition-all flex flex-col"
            >
              <div className="p-4 bg-gray-50/50 dark:bg-gray-900/20 aspect-square flex items-center justify-center relative overflow-hidden">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-h-44 w-auto object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                    {product.store.name}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm leading-snug">
                    {product.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-900">
                  <span className="text-base font-black text-gray-900 dark:text-white">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
                  </span>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
