"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

/**
 * Validates session and ensures the active store belongs to the logged-in user
 * AND has been approved by a platform administrator.
 */
async function getValidatedStore() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SELLER") {
    throw new Error("Authentication required.");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
  });

  if (!store) throw new Error("No store found for this user.");

  // Strict gate check: block unapproved storefront execution paths
  if (store.status !== "APPROVED") {
    throw new Error("Access Denied: Your storefront is pending administrative approval.");
  }

  return store;
}

// 1. Retrieve all products for the authenticated store if cleared
export async function getSellerProducts() {
  try {
    const store = await getValidatedStore();

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany(),
    ]);

    return { products, categories, storeId: store.id, isApproved: true };
  } catch (error) {
    // If validation fails because they aren't approved, drop a fallback status to the UI
    const session = await auth.api.getSession({ headers: await headers() });
    const store = session?.user ? await prisma.store.findFirst({ where: { userId: session.user.id } }) : null;

    return {
      products: [],
      categories: [],
      storeId: store?.id || null,
      isApproved: false
    };
  }
}

// 2. Action to create a product with server-side validation and status protection
export async function createProduct(formData: FormData) {
  try {
    const store = await getValidatedStore();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceInput = formData.get("price") as string;
    const stockInput = formData.get("stock") as string;
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

    if (!name || !priceInput || !stockInput || !categoryId) {
      return { success: false, error: "Missing required fields." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: new Prisma.Decimal(priceInput),
        stock: parseInt(stockInput),
        categoryId,
        storeId: store.id,
        images: [imageUrl],
      },
    });

    revalidatePath("/dashboard/seller/products");
    return { success: true };
  } catch (error: any) {
    console.error("Product creation error:", error);
    return { success: false, error: error.message || "Failed to persist product to database." };
  }
}

// 3. Action to delete a product (Guarded by store status verification)
export async function deleteProduct(productId: string) {
  try {
    const store = await getValidatedStore();

    await prisma.product.deleteMany({
      where: {
        id: productId,
        storeId: store.id
      },
    });

    revalidatePath("/dashboard/seller/products");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "Could not remove product." };
  }
}
