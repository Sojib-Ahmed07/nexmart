"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CreditCard, Loader2, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { initiateSSLCommerzPayment } from './actions';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await initiateSSLCommerzPayment(cart, cartTotal);

    if (res.success && res.GatewayPageURL) {
      // Redirect the client's window to SSLCommerz sandboxed web gateway form directly
      window.location.href = res.GatewayPageURL;
    } else {
      setError(res.error || "Payment routing initialization encountered issues.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold">No Checkout Selections Found</h2>
        <Link href="/shop" className="mt-4 text-sm font-semibold text-indigo-600 hover:underline">
          Return to Marketplace Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* BILLING AND PAYMENT TRIGGERS CONTAINER */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Secure Checkout</h2>
            <p className="text-xs text-gray-500 mt-0.5">Payments processed via SSLCommerz Sandboxed network protocols.</p>
          </div>

          {error && (
            <div className="p-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Payment Instrument Channel</span>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <CreditCard className="h-4 w-4 text-indigo-500" /> SSLCommerz Unified Gateway (bKash, Nagad, Cards)
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Provisioning Secure Session...
                </>
              ) : (
                `Pay Now (${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cartTotal)})`
              )}
            </button>
          </form>

          <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1 justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Authorized SSLCommerz Transaction Sandbox Node
          </div>
        </div>

        {/* ORDER RECAP RIGHT DISPLAY PANELS */}
        <div className="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4" /> Selected Items Summary
          </h3>
          <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-sm font-medium">
                <div className="min-w-0">
                  <span className="text-gray-900 dark:text-white truncate block">{item.name}</span>
                  <span className="text-xs text-gray-400 font-normal">Qty: {item.quantity} × ${item.price}</span>
                </div>
                <span className="text-gray-900 dark:text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Grand Total Amount</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
