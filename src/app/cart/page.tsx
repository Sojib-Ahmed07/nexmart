"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Store, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart, addToCart } = useCart();

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cartTotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
        <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven&apos;t added any multi-vendor catalog inventory items to your session ledger yet.
          </p>
        </div>
        <Link href="/shop" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
          Explore Marketplace Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 md:px-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Review Your Order Cart 🛒
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Verify allocations across distributed independent vendor inventories before dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: SELECTED ITEM LINE ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-xl border border-gray-100 dark:border-gray-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate max-w-[200px] sm:max-w-[300px]">
                      {item.name}
                    </h3>

                    {/* Store Origin Identifier */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <Store className="h-3.5 w-3.5" />
                      <span className="truncate">{item.storeName}</span>
                    </div>
                  </div>
                </div>

                {/* QUANTITY AND DELETION CONTROLS */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-extrabold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price * item.quantity)}
                    </p>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)} each
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Add/Remove Increment Buttons */}
                    <div className="flex items-center border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 rounded-xl p-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => addToCart({ ...item })}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-rose-600 transition-colors"
          >
            Clear Ledger Selections
          </button>
        </div>

        {/* RIGHT COLUMN: PRICING AND SUBMISSION LEDGER */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Summary</h3>

          <div className="space-y-3 text-sm font-medium border-b border-gray-100 dark:border-gray-800 pb-4 text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal Cost</span>
              <span className="text-gray-900 dark:text-white font-semibold">{formattedTotal}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Logistics Routing</span>
              <span className="text-emerald-600 font-bold">Calculated on Next Step</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Estimated Total</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formattedTotal}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Split Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
