import React from 'react';
import { Package, CreditCard, Heart, Store, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserDashboardData } from './actions';
import { getStatusStyles } from '@/lib/status-utils';

export default async function UserDashboardPage() {
  const [data, session] = await Promise.all([
    getUserDashboardData(),
    auth.api.getSession({ headers: await headers() })
  ]);

  // Check if a store configuration entry exists for this user identity
  const storeNode = session?.user
    ? await prisma.store.findUnique({ where: { userId: session.user.id } })
    : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* HEADER SUMMARY & CALL TO ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Hello, {data.user.name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track active orders, review invoices, and manage security options.
          </p>
        </div>

        {/* Render "Become a Seller" link block only if no store profile exists in the system */}
        {!storeNode && (
          <Link
            href="/dashboard/user/become-seller"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all shrink-0 self-start sm:self-auto"
          >
            <Store size={14} /> Become a Seller <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Orders Placed', value: data.stats.totalOrders, icon: Package, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'Pending Deliveries', value: data.stats.awaitingDelivery, icon: CreditCard, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
          { label: 'Completed Purchases', value: data.stats.completedOrders, icon: Heart, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black mt-0.5 text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800/60 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900 dark:text-white">Recent Purchases</h2>
          <Link href="/dashboard/user/orders" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View Order Archives
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-400 space-y-2 max-w-xs mx-auto">
            <Package className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-700" />
            <p className="font-semibold text-gray-500">No purchase records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {data.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/user/orders/${order.id}`}
                className="flex items-center justify-between p-6 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-900 border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800 flex items-center justify-center font-mono text-xs font-bold text-gray-400 shrink-0 transition-colors">
                    #
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {order.id.slice(0, 12)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase font-mono tracking-wide ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-black text-sm text-gray-900 dark:text-white font-mono w-20 text-right">
                    {order.total}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
