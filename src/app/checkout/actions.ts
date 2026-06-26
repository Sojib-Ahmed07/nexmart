"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
// 1. Import the correct Enum types from your project's custom generated Prisma client path
import { OrderStatus, Prisma } from "../../generated/prisma/client";

export async function initiateSSLCommerzPayment(cartItems: any[], totalAmount: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, error: "Authentication required to initiate checkout." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Your basket configuration is completely empty." };
  }

  const userId = session.user.id;
  // SSLCommerz requires a unique transaction ID string (max length 50 chars)
  const tran_id = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    // Transactionally write the Order and its sub-items to PostgreSQL
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: tran_id,
          userId: userId,
          // Convert number to Prisma Decimal string format to satisfy @db.Decimal(10, 2)
          totalAmount: new Prisma.Decimal(totalAmount.toFixed(2)),
          status: OrderStatus.PAYMENT_PENDING, // Matches your enum exactly
          isPaid: false,
          phone: "",   // Default empty strings matching your schema setup
          address: "", // Will be filled post-payment or via checkout form input
        },
      });

      // Map cart line-items cleanly to multi-vendor order items
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            storeId: item.storeId, // Perfectly satisfies your schema relation rules
            quantity: Int32Array.from([item.quantity])[0], // Type safety verification for standard integers
            price: new Prisma.Decimal(item.price.toFixed(2)),
          },
        });
      }
    });

    // 2. SSLCommerz Gateway API parameters integration loop
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX === "true";

    const gatewayUrl = isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const formData = new URLSearchParams();
    formData.append("store_id", store_id!);
    formData.append("store_passwd", store_passwd!);
    formData.append("total_amount", totalAmount.toFixed(2));
    formData.append("currency", "BDT"); // SSLCommerz standard local currency context mapping
    formData.append("tran_id", tran_id);

    // API endpoint webhooks handling post-transaction loops
    formData.append("success_url", `${baseAppUrl}/api/checkout/sslcommerz/success?id=${tran_id}`);
    formData.append("fail_url", `${baseAppUrl}/api/checkout/sslcommerz/fail?id=${tran_id}`);
    formData.append("cancel_url", `${baseAppUrl}/api/checkout/sslcommerz/cancel?id=${tran_id}`);
    formData.append("ipn_url", `${baseAppUrl}/api/checkout/sslcommerz/ipn`);

    // Customer profile payload parameters
    formData.append("cus_name", session.user.name || "Customer Member");
    formData.append("cus_email", session.user.email || "customer@nexmart.internal");
    formData.append("cus_add1", "Dhaka, Bangladesh");
    formData.append("cus_city", "Dhaka");
    formData.append("cus_postcode", "1200");
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", "01700000000");

    // General mandatory checkout details
    formData.append("shipping_method", "NO");
    formData.append("product_name", "NexMart Order Multi Items");
    formData.append("product_category", "General");
    formData.append("product_profile", "general");

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, // standard format encoding parameter header
      body: formData.toString(),
    });

    const resultText = await response.text();

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch {
      // RegEx parsing fallback mechanism if the API returns XML layout data inside sandbox environment configurations
      const statusMatch = resultText.match(/<status>(.*?)<\/status>/);
      const urlMatch = resultText.match(/<GatewayPageURL>(.*?)<\/GatewayPageURL>/);
      parsedResult = {
        status: statusMatch ? statusMatch[1] : "FAILED",
        GatewayPageURL: urlMatch ? urlMatch[1] : "",
      };
    }

    if (parsedResult.status === "SUCCESS" && parsedResult.GatewayPageURL) {
      return { success: true, GatewayPageURL: parsedResult.GatewayPageURL };
    } else {
      return { success: false, error: "SSLCommerz sandbox failed to yield a valid payment gateway URL string session." };
    }

  } catch (error) {
    console.error("SSLCommerz core transaction execution process drop exception trace:", error);
    return { success: false, error: "System initialization sequence encountered structural connection drop." };
  }
}
