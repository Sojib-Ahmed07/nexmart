"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";
import { OrderStatus } from "@/generated/prisma/client";
import { getStatusStyles } from "@/lib/status-utils";

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await updateOrderStatus(orderId, e.target.value as OrderStatus);
    setLoading(false);
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs rounded-lg p-1.5 outline-none cursor-pointer border ${getStatusStyles(currentStatus)}`}
    >
      <option value="PAYMENT_PENDING">Payment Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
