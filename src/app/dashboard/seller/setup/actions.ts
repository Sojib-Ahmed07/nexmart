"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMarketplaceStore(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "SELLER") {
    return { success: false, error: "Unauthorized access allocation." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim().length < 3) {
    return { success: false, error: "Store name must be at least 3 characters long." };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const existingStore = await prisma.store.findFirst({
      where: { slug },
    });

    if (existingStore) {
      return { success: false, error: "A storefront with this name already exists." };
    }

    await prisma.store.create({
      data: {
        name,
        slug,
        description: description || "No store description provided yet.",
        status: "PENDING", // Changed from APPROVED to PENDING -> Needs Admin clearance
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/seller");
    return { success: true };
  } catch (error) {
    console.error("Store creation crash:", error);
    return { success: false, error: "Internal database tracking breakdown." };
  }
}
