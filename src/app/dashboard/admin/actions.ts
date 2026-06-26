"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getAdminDashboardData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Aggregate global platform-wide data points concurrently
  const [totalUsers, totalStores, pendingStores, allOrders] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.store.count({
      where: {
        status: "PENDING", // Tracks new vendor applications needing review
      },
    }),
    prisma.order.findMany({
      where: { isPaid: true },
      select: { totalAmount: true },
    }),
  ]);

  // Calculate gross merchandise volume (GMV) flowing through the architecture
  const globalGrossVolume = allOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

  // Fetch the latest storefront registrations for the action queue
  const recentStores = await prisma.store.findMany({
    take: 5,
    orderBy: { id: "desc" }, // Fallback sorting by unique increment if timestamps differ
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    stats: {
      globalVolume: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(globalGrossVolume),
      userCount: totalUsers,
      storeCount: totalStores,
      pendingVerifications: pendingStores,
    },
    recentStores: recentStores.map((store) => ({
      id: store.id,
      name: store.name,
      ownerName: store.user?.name || "Unknown Merchant",
      ownerEmail: store.user?.email || "",
      status: store.status,
    })),
  };
}
