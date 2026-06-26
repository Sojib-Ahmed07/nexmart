import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id")?.toString();

    if (tran_id) {
      // Mark the order status as CANCELLED in PostgreSQL
      await prisma.order.update({
        where: { id: tran_id },
        data: { status: OrderStatus.CANCELLED },
      });
    }

    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseAppUrl}/checkout/fail?txn=${tran_id || 'unknown'}`, { status: 303 });
  } catch (error) {
    console.error("SSLCommerz fail redirect error:", error);
    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseAppUrl}/cart`, { status: 303 });
  }
}
