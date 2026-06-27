import React from 'react';
import { DollarSign, Package, AlertTriangle, ArrowUpRight, Store, Clock } from 'lucide-react';
import Link from 'next/link';
import { getSellerDashboardData } from './actions';

export default async function SellerDashboardPage() {
  const data = await getSellerDashboardData();

  // State 1: Vendor has not set up a store instance configuration profile yet
  if (!data.hasStore) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in duration-300">
        <Store className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Setup Your Marketplace Storefront</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          Your account authorization parameters allow sales operations, but you haven't provisioned a namespace instance yet.
        </p>
        <Link
          href="/dashboard/seller/setup"
          className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Launch New Storefront
        </Link>
      </div>
    );
  }

  // State 2: Store exists but requires structural administrative clearance (PENDING approval)
  if (data.status !== "APPROVED") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in duration-300">
        <Clock className="h-12 w-12 text-amber-500 dark:text-amber-400 mb-4 animate-bounce duration-1000" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Under Review</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          Your storefront registration for <span className="font-semibold text-gray-800 dark:text-white">"{data.storeName}"</span> is successful. The identity structure is awaiting approval by a platform administrator.
        </p>
      </div>
    );
  }

  const cards = [
    { name: 'Gross Store Revenue', value: data.stats?.revenue, icon: DollarSign, bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
    { name: 'Active Inventory Items', value: data.stats?.productsCount, icon: Package, bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' },
    { name: 'Low Stock Alerts', value: data.stats?.lowStockWarning, icon: AlertTriangle, bg: data.stats?.lowStockWarning && data.stats.lowStockWarning > 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.storeName} Management Suite 🏪
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor multi-tenant merchant earnings and control split-vendor stock lines in real time.
        </p>
      </div>

      {/* STATS DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.name}</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* LINE ITEM ORDERS TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Sales</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Incoming ledger items purchased specifically from your store inventory allocation.</p>
          </div>
          <Link href="/dashboard/seller/orders" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            All Orders <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {data.recentSales.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No sales records mapped to your merchant namespace yet. Keep marketing!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3 px-6">Transaction ID</th>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Qty</th>
                  <th className="py-3 px-6">Payout Split</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.recentSales.map((sale, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-900 dark:text-white">{sale.id.slice(0, 8)}...</td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-semibold">{sale.productName}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">x{sale.quantity}</td>
                    <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold">{sale.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
