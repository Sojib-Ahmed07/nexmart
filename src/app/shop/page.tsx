import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Layers } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

async function getCatalogProducts(categorySlug?: string) {
  return await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      store: { status: "APPROVED" },
      // Dynamically matches the exact text string slug column if present
      ...(categorySlug
        ? {
            category: {
              slug: categorySlug,
            },
          }
        : {}),
    },
    include: {
      store: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const targetCategorySlug = resolvedParams.category;
  const products = await getCatalogProducts(targetCategorySlug);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER SECTION MAP */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-900 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider mb-2"
            >
              <ArrowLeft size={12} /> Index Return
            </Link>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              Marketplace Catalog <ShoppingBag className="h-7 w-7 text-indigo-600" />
            </h1>
            {targetCategorySlug && products.length > 0 && (
              <p className="text-xs font-mono inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-1 rounded-md mt-1 font-bold">
                <Layers size={12} /> Active Node: {products[0].category.name} (/{targetCategorySlug})
              </p>
            )}
          </div>
        </div>

        {/* INVENTORY MAPPING RESULTS GRID */}
        {products.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 text-sm max-w-md mx-auto space-y-2">
            <ShoppingBag className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-700" />
            <p className="font-semibold">No operational units found.</p>
            <p className="text-xs text-gray-500">There are no matching verified listings assigned to this category query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
    </div>
  );
}
