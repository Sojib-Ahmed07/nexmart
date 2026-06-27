import React from 'react';
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStatusStyles } from "@/lib/status-utils";

export default async function UserAllOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">All Orders</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-mono">{order.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">${order.totalAmount.toString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
