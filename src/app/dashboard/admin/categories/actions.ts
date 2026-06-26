"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAdminCategories() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access.");
  }

  return await prisma.category.findMany({
    orderBy: { id: "desc" },
  });
}

export async function createGlobalCategory(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Category name must be at least 2 characters." };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    await prisma.category.create({
      data: { name, slug },
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Category or slug identifier already exists." };
  }
}
