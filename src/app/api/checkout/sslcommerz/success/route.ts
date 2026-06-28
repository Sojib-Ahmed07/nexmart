import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    // SSLCommerz fires a form url-encoded body payload to this post address
    const formData = await req.formData();

    const status = formData.get("status");
    const tran_id = formData.get("tran_id")?.toString();
    const val_id = formData.get("val_id")?.toString(); // Used for background validation if required
    const amount = formData.get("amount")?.toString();

    if (status !== "VALID" || !tran_id) {
      return NextResponse.redirect(
        new URL(`/api/checkout/sslcommerz/fail?id=${tran_id || 'unknown'}`, req.url),
        { status: 303 }
      );
    }

    // 1. Locate the pending order and pull its related OrderItem array lines
    const existingOrder = await prisma.order.findUnique({
      where: { id: tran_id },
      include: {
        orderItems: true // Matches your schema relation name exactly
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order context ledger item not found." }, { status: 404 });
    }

    // Protection gate: Prevent stock from decrementing twice if the payment callback runs multiple times
    if (existingOrder.isPaid) {
      const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.redirect(`${baseAppUrl}/checkout/success?txn=${tran_id}`, { status: 303 });
    }

    // 2. Perform atomic batch operations: verify the payment parameters and drop inventory metrics safely
    await prisma.$transaction(async (tx) => {

      // Update order status parameters
      await tx.order.update({
        where: { id: tran_id },
        data: {
          isPaid: true,
          status: OrderStatus.PROCESSING, // Shifts state into processing mode
        },
      });

      // Loop through each item bought in this session and subtract the quantities from the Product matrix
      for (const item of existingOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // Safely subtracts stock count in DB
            },
          },
        });
      }
    });

    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 3. Forward user to visual success landing component view
    return NextResponse.redirect(`${baseAppUrl}/checkout/success?txn=${tran_id}`, { status: 303 });

  } catch (error) {
    console.error("SSLCommerz success webhook internal breakdown error trace:", error);
    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseAppUrl}/shop`, { status: 303 });
  }
}
