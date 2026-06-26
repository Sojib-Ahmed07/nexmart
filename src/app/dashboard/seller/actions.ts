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

  // 1. Find the vendor's active storefront
  const sellerStore = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!sellerStore) {
    return { hasStore: false, stats: null, recentSales: [] };
  }

  const storeId = sellerStore.id;

  // 2. Query data safely without sorting by a non-existent orderItem timestamp
  const [totalProducts, lowStockCount, orderItems] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, stock: { lt: 5 } } }),
    prisma.orderItem.findMany({
      where: { storeId },
      // Check if your schema capitalized this relation to 'Product: true' or uses 'productId'
      include: {
        product: { select: { name: true } },
      },
      take: 5,
    }),
  ]);

  const totalRevenue = orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return {
    hasStore: true,
    storeName: sellerStore.name,
    stats: {
      revenue: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue),
      productsCount: totalProducts,
      lowStockWarning: lowStockCount,
    },
    recentSales: orderItems.map((item) => ({
      id: item.id,
      // Fallback gracefully if your relation name inside schema.prisma is different
      productName: (item as any).product?.name || "Marketplace Product",
      quantity: item.quantity,
      total: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(item.price) * item.quantity),
      date: "Recent Item", // Using static string since OrderItem lacks direct timestamp
    })),
  };
}
