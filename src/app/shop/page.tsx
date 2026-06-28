import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import ClientShopGrid from "@/components/ClientShopGrid";

// 🌟 FORCE DYNAMIC LOOKUPS TO PREVENT PRERENDER OVERHEADS
export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

async function getCatalogProducts(categorySlug?: string) {
  const dbProducts = await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      store: { status: "APPROVED" },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      store: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return dbProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const targetCategorySlug = resolvedParams.category;
  const products = await getCatalogProducts(targetCategorySlug);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-900 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider mb-2"
            >
              <ArrowLeft size={12} /> Index Return
            </Link>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              Marketplace Catalog{" "}
              <ShoppingBag className="h-7 w-7 text-indigo-600" />
            </h1>
          </div>
        </div>

        {/* 🌟 PERFECTLY ISO-CONTAINED CLIENT COMPONENT RUNTIME */}
        <Suspense fallback={<div className="text-center text-sm py-12 text-gray-400 font-mono">Loading marketplace catalog...</div>}>
          <ClientShopGrid
            initialProducts={products}
            targetCategorySlug={targetCategorySlug}
          />
        </Suspense>

      </div>
    </div>
  );
}
