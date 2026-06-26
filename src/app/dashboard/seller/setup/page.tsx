"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createMarketplaceStore } from './actions';

export default function SellerSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createMarketplaceStore(formData);

    if (result.success) {
      // Force refresh data boundaries and return straight to the clean dashboard
      router.push('/dashboard/seller');
      router.refresh();
    } else {
      setError(result.error || "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      <Link
        href="/dashboard/seller"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create Vendor Storefront
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set up your identity instance within the multi-tenant marketplace platform.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-sm font-medium flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Storefront Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g., Pixel Craft Tech"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Storefront Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your stock niche, logistics processing speeds, or tech hardware profiles..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Provisioning Infrastructure...
              </>
            ) : (
              "Initialize Marketplace Node"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
