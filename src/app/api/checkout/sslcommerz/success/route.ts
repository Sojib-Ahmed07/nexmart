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

    // 1. Locate the pending database instance transaction entry safely
    const existingOrder = await prisma.order.findUnique({
      where: { id: tran_id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order context ledger item not found." }, { status: 404 });
    }

    // 2. Atomically flip status parameters matching your Prisma rules
    await prisma.order.update({
      where: { id: tran_id },
      data: {
        isPaid: true,
        status: OrderStatus.PROCESSING, // Advance pipeline state to processing!
      },
    });

    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 3. Forward user to a visual success landing component view (passing clear flag to wipe client cart cache)
    return NextResponse.redirect(`${baseAppUrl}/checkout/success?txn=${tran_id}`, { status: 303 });

  } catch (error) {
    console.error("SSLCommerz success webhook internal breakdown error trace:", error);
    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseAppUrl}/shop`, { status: 303 });
  }
}
