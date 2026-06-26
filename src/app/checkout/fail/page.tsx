"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function FailContent() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get('txn');

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto space-y-6">
      <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500">
        <XCircle className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Payment Failed
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The transaction gateway could not process your payment instrument. No funds were debited.
        </p>
      </div>

      {txnId && txnId !== 'unknown' && (
        <div className="w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 font-mono text-xs text-gray-400">
          <span className="block font-bold uppercase tracking-wider text-[10px] text-gray-400 mb-1">Failed Transaction ID</span>
          {txnId}
        </div>
      )}

      <div className="pt-2 w-full flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Re-paying
        </Link>
        <Link
          href="/cart"
          className="flex-1 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Cart
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center text-sm text-gray-400">Loading error telemetry...</div>}>
      <FailContent />
    </Suspense>
  );
}
