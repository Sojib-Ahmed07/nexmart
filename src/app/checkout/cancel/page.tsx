"use client";

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto space-y-6">
      <div className="h-20 w-20 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-500">
        <ShoppingBag className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Transaction Cancelled
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You exited the SSLCommerz interface shell before completing your purchase.
        </p>
      </div>

      <div className="pt-2 w-full">
        <Link
          href="/cart"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          Review Cart & Retry Checkout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
