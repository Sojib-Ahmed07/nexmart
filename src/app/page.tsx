import React from 'react';
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import HeroSlider from '@/components/home/HeroSlider';
import CategoryHub from '@/components/home/CategoryHub';
import TrendingHardware from '@/components/home/TrendingHardware';
import MerchantSpotlight from '@/components/home/MerchantSpotlight';
import DualActionCTA from '@/components/home/DualActionCTA';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, LayoutGrid } from 'lucide-react';

async function getHomepageData() {
  const [session, categories, trendingProducts, verifiedStores] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    // Fetch active categories straight from your DB
    prisma.category.findMany({
      take: 8,
      orderBy: { name: "asc" }
    }),
    // Fetch live inventory items
    prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        store: { status: "APPROVED" }
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { name: true } }
      }
    }),
    // Fetch current verified merchant entities
    prisma.store.findMany({
      where: { status: "APPROVED" },
      take: 3,
      orderBy: { id: "desc" },
      include: {
        _count: { select: { products: true } }
      }
    })
  ]);

  return { session, categories, trendingProducts, verifiedStores };
}

export default async function HomePage() {
  const { session, categories, trendingProducts, verifiedStores } = await getHomepageData();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-24 space-y-24">

      {/* STATIC INSTALLED HERO CAROUSEL */}
      <HeroSlider />

      {/* DYNAMIC CATEGORIES INJECTION */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-indigo-600" />
            </h2>
          </div>
          <CategoryHub categories={categories} />
        </section>
      )}

      {/* DYNAMIC RECENT OPEN LISTINGS */}
      {trendingProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <ArrowRight size={14} />
            </Link>
          </div>
          <TrendingHardware products={trendingProducts} />
        </section>
      )}

      {/* DYNAMIC VERIFIED MERCHANT NETWORK */}
      {verifiedStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </h2>
          </div>
          <MerchantSpotlight stores={verifiedStores} />
        </section>
      )}

      {/* CONTEXT-DRIVEN CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DualActionCTA
          isAuthenticated={!!session?.user}
          userRole={session?.user?.role}
        />
      </section>

    </main>
  );
}
