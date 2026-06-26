import React from 'react';
import { ShieldCheck, Users, Store, BarChart3, ArrowUpRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getAdminDashboardData } from './actions';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  const metrics = [
    { name: 'Gross Platform Volume', value: data.stats.globalVolume, icon: BarChart3, bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' },
    { name: 'Total Accounts', value: data.stats.userCount, icon: Users, bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' },
    { name: 'Active Storefronts', value: data.stats.storeCount, icon: Store, bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Platform Master Console <ShieldCheck className="h-7 w-7 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Global administrative controls, merchant verification pipelines, and network metrics monitoring.
          </p>
        </div>

        {data.stats.pendingVerifications > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 text-xs font-semibold shadow-sm animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {data.stats.pendingVerifications} Merchant Application(s) Awaiting Review
          </div>
        )}
      </div>

      {/* METRIC GRIDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${metric.bg}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* VENDOR ONBOARDING MONITOR */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Store Approvals Status</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track registration states across third-party vendor applications.</p>
          </div>
          <Link href="/dashboard/admin/stores" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            Manage All Stores <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {data.recentStores.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No marketplace storefront instances have been registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3 px-6">Store Name</th>
                  <th className="py-3 px-6">Merchant Operator</th>
                  <th className="py-3 px-6">Status State</th>
                  <th className="py-3 px-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.recentStores.map((store, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-bold">{store.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-950 dark:text-gray-200">{store.ownerName}</span>
                        <span className="text-xs text-gray-400 font-mono">{store.ownerEmail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        store.status === "APPROVED"
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : store.status === "PENDING"
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/dashboard/admin/stores?id=${store.id}`} className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 shadow-sm transition-colors">
                        Review File
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
