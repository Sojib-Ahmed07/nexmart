import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, ArrowUpRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getUserDashboardData } from './actions';

export default async function UserDashboardPage() {
  const data = await getUserDashboardData();

  const cards = [
    { name: 'Total Orders', value: data.stats.totalOrders, icon: ShoppingBag, bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' },
    { name: 'Awaiting Delivery', value: data.stats.awaitingDelivery, icon: Clock, bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
    { name: 'Completed Purchases', value: data.stats.completedOrders, icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back, {data.user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here is your customer activity ledger. All information is loaded live from your account.
        </p>
      </div>

      {/* STATS SECTION */}
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

      {/* TRANSACTIONAL TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Purchases</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your latest platform purchases.</p>
          </div>
          <Link href="/dashboard/user/orders" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No transaction ledger matching your customer footprint was found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Total Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-900 dark:text-white">{order.id}</td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white">{order.total}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "PROCESSING"
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/dashboard/user/orders/${order.id}`} className="inline-flex items-center justify-center p-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
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
