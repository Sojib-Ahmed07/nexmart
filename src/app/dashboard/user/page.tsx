import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle2, ArrowUpRight, ChevronRight } from 'lucide-react';
import { getUserDashboardData } from './actions';
import { getStatusStyles } from '@/lib/status-utils';

export default async function UserDashboardPage() {
  const data = await getUserDashboardData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {data.user.name.split(' ')[0]} 👋</h1>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20">
                <td className="py-4 px-6 font-mono text-xs">{order.id}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/dashboard/user/orders/${order.id}`}>
                    <ChevronRight className="h-4 w-4 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
