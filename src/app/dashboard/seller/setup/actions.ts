"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMarketplaceStore(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verify authentication context and permissions
  if (!session || !session.user || session.user.role !== "SELLER") {
    return { success: false, error: "Unauthorized access allocation." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim().length < 3) {
    return { success: false, error: "Store name must be at least 3 characters long." };
  }

  // Generate a clean URL-friendly slug (e.g., "Alpha Gadgets" -> "alpha-gadgets")
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    // 1. Verify slug uniqueness to prevent namespace collisions
    const existingStore = await prisma.store.findFirst({
      where: { slug },
    });

    if (existingStore) {
      return { success: false, error: "A storefront with this name or slug configuration already exists." };
    }

    // 2. Provision the database entry bound to this seller's account id
    await prisma.store.create({
      data: {
        name,
        slug,
        description: description || "No store description provided yet.",
        status: "APPROVED", // Auto-approve for seamless local dev testing
        userId: session.user.id,
      },
    });

    // Reset the cached path parameters so the layout updates immediately
    revalidatePath("/dashboard/seller");

    return { success: true };
  } catch (error) {
    console.error("Store creation crash:", error);
    return { success: false, error: "Internal database tracking breakdown." };
  }
}
