import React from 'react';
import { Package, CreditCard, Heart, MapPin, ArrowRight } from 'lucide-react';
import { getUserDashboardData } from './actions';
import { getStatusStyles } from '@/lib/status-utils';

export default async function UserDashboardPage() {
  const data = await getUserDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Hello, {data.user.name.split(' ')[0]}</h1>
          <p className="text-gray-500">Manage your purchases, preferences, and account security.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Orders', value: data.stats.totalOrders, icon: Package, color: 'text-blue-600' },
          { label: 'Pending Deliveries', value: data.stats.awaitingDelivery, icon: CreditCard, color: 'text-amber-600' },
          { label: 'Completed', value: data.stats.completedOrders, icon: Heart, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS TABLE - PRO VERSION */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {data.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-mono text-xs">ID</div>
                <div>
                  <p className="font-semibold text-sm">{order.id.slice(0, 12)}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(order.status)}`}>
                  {order.status}
                </span>
                <p className="font-bold">{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
