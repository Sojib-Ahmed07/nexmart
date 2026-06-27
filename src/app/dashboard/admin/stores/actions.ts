"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { StoreStatus } from "@/generated/prisma/client";

/**
 * Ensures request is signed by an explicit system administrator role
 */
async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Access Denied. Administrative credentials required.");
  }
}

/**
 * Fetches all stores across the entire multi-tenant system
 */
export async function getAllSystemStores() {
  await assertAdmin();

  return await prisma.store.findMany({
    orderBy: { id: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      },
      _count: { select: { products: true } }
    }
  });
}

/**
 * Handles store appeals (Approving or Rejecting a storefront request)
 */
export async function updateStoreStatus(storeId: string, status: StoreStatus) {
  await assertAdmin();

  try {
    // 1. Mutate store clearance level state
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status },
    });

    // 2. If APPROVED, promote the associated User record role to "SELLER" automatically
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: updatedStore.userId },
        data: { role: "SELLER" }
      });
    }

    revalidatePath("/dashboard/admin/stores");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Store status mutation error:", error);
    return { success: false, error: "Failed to update vendor clearance profile." };
  }
}

/**
 * Deletes any user account globally from the platform registry
 */
export async function purgeUserAccount(userId: string) {
  await assertAdmin();

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/admin/stores");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Could not safely drop account profile." };
  }
}
