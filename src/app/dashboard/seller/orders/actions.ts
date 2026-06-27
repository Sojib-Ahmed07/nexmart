"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  // 1. Authenticate Request
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SELLER") {
    throw new Error("Unauthorized: Access Denied.");
  }

  // 2. Locate Seller's Store
  const store = await prisma.store.findFirst({
    where: { userId: session.user.id }
  });

  if (!store) {
    throw new Error("Store not provisioned for this account.");
  }

  // 3. Security Check: Ensure the requested OrderID actually contains items for this specific store
  // This prevents sellers from modifying orders that do not belong to them.
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      orderId,
      storeId: store.id
    }
  });

  if (!orderItem) {
    throw new Error("Security Violation: Order allocation not found in your store.");
  }

  // 4. Perform Atomic Update
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });

  // 5. Invalidate paths to force fresh data fetching across the app
  // This updates the Seller's view AND the User's "My Orders" dashboard
  revalidatePath("/dashboard/seller/orders");
  revalidatePath("/dashboard/user");
  revalidatePath(`/dashboard/user/orders/[id]`, "page");

  return { success: true };
}
