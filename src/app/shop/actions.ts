"use server";

import prisma from "@/lib/prisma";

export async function getMarketplaceCatalog(selectedCategorySlug?: string) {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: selectedCategorySlug && selectedCategorySlug !== "all"
          ? { category: { slug: selectedCategorySlug } }
          : {},
        include: {
          store: {
            select: { name: true }
          }
        },
        orderBy: { id: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" }
      })
    ]);

    return { products, categories };
  } catch (error) {
    console.error("Failed to load catalog data:", error);
    return { products: [], categories: [] };
  }
}

export async function getProductDetailsBySlug(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        store: {
          select: { name: true, description: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      }
    });

    return product;
  } catch (error) {
    console.error("Failed to query custom item layout reference:", error);
    return null;
  }
}
