"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Asserts the actor possesses explicit platform admin credentials
 */
async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Access Denied: Administrative permissions required.");
  }
}

/**
 * Retrieves all registered user records across the cluster infrastructure
 */
export async function getAllSystemUsers() {
  await assertAdmin();

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      store: {
        select: { name: true }
      }
    }
  });
}

/**
 * Permanently deletes a user profile from the database registry
 */
export async function deleteUserAccount(userId: string) {
  await assertAdmin();

  try {
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin/stores");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("User execution error:", error);
    return { success: false, error: "Failed to purge user account from cluster." };
  }
}
