import React from "react";
import { getAllSystemUsers } from "./actions";
import DeleteUserButton from "./DeleteUserButton";
import { Users, Shield, Store, User } from "lucide-react";

export default async function AdminUsersManagementPage() {
  const users = await getAllSystemUsers();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Global User Directory <Users className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Inspect global system profile registries, verify security role allocations, and enforce access bans.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No global user account instances mapped to the registry cluster.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-4 px-6">User Account Instance</th>
                  <th className="py-4 px-6">Assigned System Role</th>
                  <th className="py-4 px-6">Affiliated Storefront</th>
                  <th className="py-4 px-6 text-center">Administrative Safety Purge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                {users.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                    {/* IDENTITY DATA PROFILE */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {account.name || "Unnamed Account"}
                        </span>
                        <span className="text-xs text-gray-400 font-mono mt-0.5">{account.email}</span>
                      </div>
                    </td>

                    {/* ROLE DECK INDICATOR */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        account.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                          : account.role === "SELLER"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {account.role === "ADMIN" ? (
                          <Shield size={12} />
                        ) : account.role === "SELLER" ? (
                          <Store size={12} />
                        ) : (
                          <User size={12} />
                        )}
                        {account.role}
                      </span>
                    </td>

                    {/* AFFILIATED STORE ENTITY BLOCK */}
                    <td className="py-4 px-6">
                      {account.store ? (
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {account.store.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No tenant store allocated
                        </span>
                      )}
                    </td>

                    {/* DESTRUCTIVE ACCOUNT DROP EXECUTION CELL */}
                    <td className="py-4 px-6 text-center">
                      {/* Safety Guard: Block the active Admin from running a self-deletion drop */}
                      {account.role === "ADMIN" ? (
                        <span className="text-xs font-mono text-gray-400 select-none">Protected Node</span>
                      ) : (
                        <DeleteUserButton userId={account.id} userName={account.name || account.email} />
                      )}
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
