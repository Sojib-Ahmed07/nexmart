import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import ClientShopGrid from "@/components/ClientShopGrid";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

// 1. Fetch catalog data natively from database
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
      price: true, // This returns a Prisma Decimal object
      images: true,
      store: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Map through the products and sanitize the Decimal object into a plain number
  return dbProducts.map((product) => ({
    ...product,
    price: Number(product.price), // Converts Decimal object securely to a plain JS number
  }));
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const targetCategorySlug = resolvedParams.category;

  // Run the sanitized fetch pipeline
  const products = await getCatalogProducts(targetCategorySlug);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER SECTION */}
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
          </div>
        </div>

        {/* 3. Plain primitives are now securely handed to the Client Components */}
        <ClientShopGrid initialProducts={products} targetCategorySlug={targetCategorySlug} />

      </div>
    </div>
  );
}
