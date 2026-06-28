"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function applyForSellerStorefront(formData: { name: string; description: string }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Authentication token missing." };
  }

  const existingStore = await prisma.store.findFirst({
    where: { userId: session.user.id }
  });

  if (existingStore) {
    return { success: false, error: "A tenant partition is already assigned to this account." };
  }

  const storeSlug = formData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    // Keep user's role as USER until admin changes status code field to APPROVED
    await prisma.store.create({
      data: {
        name: formData.name,
        slug: storeSlug,
        description: formData.description,
        status: "PENDING",
        userId: session.user.id
      }
    });

    revalidatePath("/dashboard/user");
    return { success: true };
  } catch (error: any) {
    console.error("Store registration exception:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Store namespace handles must be globally unique." };
    }
    return { success: false, error: "Failed to compile store context mapping into database registry." };
  }
}
