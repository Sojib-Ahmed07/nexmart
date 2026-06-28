import React from 'react';
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// 1. Explicitly type params as a Promise for async parameter resolution
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  // 2. Await the params object before extracting the dynamic ID property
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  // 3. Swap findUnique to findFirst to avoid compound index runtime limitations
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) redirect("/dashboard/user/orders");

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">Items Purchased</h3>
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex justify-between border-b dark:border-gray-800 py-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>${item.price.toString()}</span>
          </div>
        ))}
        <div className="pt-4 font-bold text-lg">Total: ${order.totalAmount.toString()}</div>
      </div>
    </div>
  );
}
