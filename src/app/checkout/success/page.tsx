"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const txnId = searchParams.get('txn');

  // Clear out cached items exactly ONCE when the confirmation component lands on screen
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto space-y-6">
      <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-500 animate-pulse">
        <CheckCircle className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Payment Captured!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your order transaction has been registered and allocated across vendors.
        </p>
      </div>

      {txnId && (
        <div className="w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 font-mono text-xs text-gray-400 select-all">
          <span className="block font-bold uppercase tracking-wider text-[10px] text-gray-400 mb-1">Transaction Ref Reference</span>
          {txnId}
        </div>
      )}

      <div className="pt-2 w-full flex flex-col gap-3">
        <Link
          href="/shop"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          Keep Browsing Marketplace <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[75vh] flex items-center justify-center text-sm text-gray-400 font-medium">
        Loading completion dashboard indicators...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
