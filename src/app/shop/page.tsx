import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, Tag } from 'lucide-react';
import { getMarketplaceCatalog } from './actions';

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PublicShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "all";

  const { products, categories } = await getMarketplaceCatalog(activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 md:px-12 space-y-10">
      {/* HEADER HERO AREA */}
      <div className="max-w-7xl mx-auto text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          The NexMart Marketplace 🛒
        </h1>
        <p className="text-md text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Browse items published instantly across our independent multi-tenant vendor storefront nodes.
        </p>
      </div>

      {/* CATEGORY CHIPS FILTER COMPONENT */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2.5">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${activeCategory === "all"
            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
            }`}
        >
          All Items
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${activeCategory === category.slug
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
              }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* PRODUCT INTERACTIVE CATALOG GRID */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Inventory Match</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              No merchant items have been added to this taxonomy mapping segment yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* IMAGE BOUND */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-50 dark:border-gray-800">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* METADATA SHIFT BODY */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    {/* Store Origin Badge */}
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
                      <Store className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-medium truncate">{(product as any).store?.name || "Merchant Node"}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description || "No specific details published."}
                    </p>
                  </div>

                  {/* WITH THIS UPDATED TYPE-SAFE ROUTING CODE: */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
                    </span>

                    <Link
                      href={`/shop/${product.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-bold tracking-wide transition-colors shadow-sm inline-flex items-center justify-center"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
