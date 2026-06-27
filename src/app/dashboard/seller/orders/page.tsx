import React from 'react';
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StatusUpdater from "./StatusUpdater";

export default async function SellerOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SELLER") redirect("/login");

  const store = await prisma.store.findFirst({ where: { userId: session.user.id } });
  if (!store) redirect("/dashboard/seller/setup");

  const orders = await prisma.orderItem.findMany({
    where: { storeId: store.id },
    include: {
      product: { select: { name: true } },
      order: { select: { id: true, status: true, createdAt: true } }
    },
    orderBy: { order: { createdAt: 'desc' } }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Received Orders</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {orders.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium">{item.product.name}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">
                  <StatusUpdater orderId={item.order.id} currentStatus={item.order.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {item.order.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
