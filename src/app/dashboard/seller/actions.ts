"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSellerDashboardData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "SELLER") {
    redirect("/login");
  }

  const sellerStore = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!sellerStore) {
    return { hasStore: false, status: null, stats: null, recentSales: [] };
  }

  // If store exists but isn't approved, skip data fetching to save performance
  if (sellerStore.status !== "APPROVED") {
    return {
      hasStore: true,
      status: sellerStore.status,
      storeName: sellerStore.name,
      stats: null,
      recentSales: []
    };
  }

  const storeId = sellerStore.id;

  const [totalProducts, lowStockCount, orderItems] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, stock: { lt: 5 } } }),
    prisma.orderItem.findMany({
      where: { storeId },
      include: {
        product: { select: { name: true } },
      },
      take: 5,
    }),
  ]);

  const totalRevenue = orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return {
    hasStore: true,
    status: sellerStore.status,
    storeName: sellerStore.name,
    stats: {
      revenue: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue),
      productsCount: totalProducts,
      lowStockWarning: lowStockCount,
    },
    recentSales: orderItems.map((item) => ({
      id: item.id,
      productName: item.product?.name || "Marketplace Product",
      quantity: item.quantity,
      total: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(item.price) * item.quantity),
      date: "Recent Item",
    })),
  };
}
