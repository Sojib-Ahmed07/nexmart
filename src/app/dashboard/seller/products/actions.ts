"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// 1. Get all products owned by this seller
export async function getSellerProducts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "SELLER") {
    throw new Error("Unauthorized");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!store) return { products: [], categories: [] };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { id: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
    }),
  ]);

  return { products, categories, storeId: store.id };
}

// 2. Action to create a brand new product listing
export async function createProduct(formData: FormData, storeId: string) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"; // fallback mockup image

  if (!name || isNaN(price) || isNaN(stock) || !categoryId) {
    return { success: false, error: "Missing required fields or invalid numeric inputs." };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        storeId,
        images: [imageUrl],
      },
    });

    revalidatePath("/dashboard/seller/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Database rejected listing instance creation." };
  }
}
