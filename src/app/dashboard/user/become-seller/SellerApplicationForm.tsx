"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyForSellerStorefront } from "./actions";
import { Store, Loader2, ArrowRight } from "lucide-react";

export default function SellerApplicationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || !description) {
      setError("All tracking properties must be declared.");
      return;
    }

    startTransition(async () => {
      const result = await applyForSellerStorefront({ name, description });
      if (result.success) {
        router.refresh();
        router.push("/dashboard/seller");
      } else {
        setError(result.error || "An unexpected database exception occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 text-xs font-mono font-bold">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Store Name</label>
        <input
          name="name"
          type="text"
          required
          disabled={isPending}
          placeholder="Enterprise Core Systems"
          className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 disabled:opacity-50 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Storefront Summary</label>
        <textarea
          name="description"
          rows={4}
          required
          disabled={isPending}
          placeholder="Outline the architecture configuration components or product lines you intend to manage..."
          className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 disabled:opacity-50 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin text-indigo-200" />
        ) : (
          <> Initialize Merchant Pipeline <ArrowRight size={14} /> </>
        )}
      </button>
    </form>
  );
}
