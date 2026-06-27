"use client";

import React, { useTransition } from "react";
import { updateStoreStatus } from "./actions";
import { StoreStatus } from "@/generated/prisma/client";
import { Check, X, Loader2 } from "lucide-react";

interface StatusControlProps {
  storeId: string;
  currentStatus: StoreStatus;
}

export default function StatusControl({ storeId, currentStatus }: StatusControlProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: StoreStatus) => {
    startTransition(async () => {
      const res = await updateStoreStatus(storeId, status);
      if (!res.success) alert(res.error);
    });
  };

  if (currentStatus !== "PENDING") {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        currentStatus === "APPROVED"
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
      }`}>
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      {isPending ? (
        <Loader2 size={16} className="animate-spin text-gray-400" />
      ) : (
        <>
          <button
            onClick={() => handleUpdate("APPROVED" as StoreStatus)}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold px-2.5"
            title="Approve Store Request"
          >
            <Check size={14} /> Approve
          </button>
          <button
            onClick={() => handleUpdate("REJECTED" as StoreStatus)}
            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold px-2.5"
            title="Reject Store Request"
          >
            <X size={14} /> Reject
          </button>
        </>
      )}
    </div>
  );
}
