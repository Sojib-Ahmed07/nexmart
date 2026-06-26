"use server";

import prisma from "@/lib/prisma"; // Adjust this to match your real Prisma singleton instance path
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getUserDashboardData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Query your real live database concurrently
  const [totalOrders, processingOrders, completedOrders, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: "PROCESSING" } }),
    prisma.order.count({ where: { userId, status: "DELIVERED" } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
    stats: {
      totalOrders,
      awaitingDelivery: processingOrders,
      completedOrders,
    },
    recentOrders: recentOrders.map(order => ({
      id: order.id,
      date: order.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      total: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(order.totalAmount)),
      status: order.status,
    })),
  };
}
