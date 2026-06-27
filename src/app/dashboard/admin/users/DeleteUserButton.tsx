"use client";

import React, { useTransition } from "react";
import { UserX, Loader2 } from "lucide-react";
import { deleteUserAccount } from "./actions";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        `CRITICAL ADMINISTRATIVE ALERT: Are you completely certain you want to permanently delete "${userName}"? This will drop their identity parameters and associated records.`
      )
    ) {
      startTransition(async () => {
        const res = await deleteUserAccount(userId);
        if (!res.success) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50"
      title="Purge User Record"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin text-rose-400" />
      ) : (
        <UserX size={16} />
      )}
    </button>
  );
}
