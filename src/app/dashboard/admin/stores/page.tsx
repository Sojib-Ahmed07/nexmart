import React from "react";
import { getAllSystemStores } from "./actions";
import StatusControl from "./StatusControl";
import PurgeUserButton from "./PurgeUserButton";
import { Store, Package } from "lucide-react";

export default async function AdminStoresManagementPage() {
  const stores = await getAllSystemStores();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Store Operations Registry <Store className="h-7 w-7 text-indigo-600" />
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review onboarding vendor storefront applications, authorize merchant roles, or execute account purges.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {stores.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No application profile instances mapped to the cluster nodes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-4 px-6">Store Instance Info</th>
                  <th className="py-4 px-6">Merchant Profile</th>
                  <th className="py-4 px-6">Catalog Metrics</th>
                  <th className="py-4 px-6 text-right">Verification Clearance Action</th>
                  <th className="py-4 px-6 text-center">System Safety</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                    {/* STORE HEADER PROFILE */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{store.name}</span>
                        <span className="text-xs text-gray-400 font-mono mt-0.5">/{store.slug}</span>
                      </div>
                    </td>

                    {/* OPERATOR DATA CELL */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{store.user?.name || "Unknown Operator"}</span>
                        <span className="text-xs text-gray-400 font-mono">{store.user?.email}</span>
                        <span className="text-[10px] mt-1 font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                          Role: {store.user?.role}
                        </span>
                      </div>
                    </td>

                    {/* METRICS INVENTORY BLOCK */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                        <Package size={16} className="text-gray-400" />
                        {store._count.products} item listings
                      </div>
                    </td>

                    {/* VERIFICATION ACTIONS CELL */}
                    <td className="py-4 px-6 text-right">
                      <StatusControl storeId={store.id} currentStatus={store.status} />
                    </td>

                    {/* CLEAN SAFETY CELL USING NEW CLIENT BUTTON */}
                    <td className="py-4 px-6 text-center">
                      <PurgeUserButton userId={store.userId} />
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
