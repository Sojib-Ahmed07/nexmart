import React from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: any;
  stock: number;
  store: {
    name: string;
  };
}

interface TrendingHardwareProps {
  products: Product[];
}

export default function TrendingHardware({ products }: TrendingHardwareProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md overflow-hidden transition-all flex flex-col">
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/20 aspect-square flex items-center justify-center relative overflow-hidden">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-44 w-auto object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {product.stock <= 5 && (
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                {product.stock}
              </span>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wide truncate block">
                {product.store.name}
              </span>
              <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {product.name}
              </h4>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-black text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
              </span>
              <Link
                href={`/shop/${product.slug}`}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors"
              >
                ➔
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
