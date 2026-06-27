"use client";

import React, { useTransition } from "react";
import { UserX, Loader2 } from "lucide-react";
import { purgeUserAccount } from "./actions";

interface PurgeUserButtonProps {
  userId: string;
}

export default function PurgeUserButton({ userId }: PurgeUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handlePurge = () => {
    if (
      confirm(
        "CRITICAL ADMIN WARNING: Permanently delete this entire account along with all their storefront items? This cannot be undone."
      )
    ) {
      startTransition(async () => {
        const res = await purgeUserAccount(userId);
        if (!res.success) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handlePurge}
      disabled={isPending}
      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50"
      title="Purge User Account Completely"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin text-rose-400" />
      ) : (
        <UserX size={16} />
      )}
    </button>
  );
}
