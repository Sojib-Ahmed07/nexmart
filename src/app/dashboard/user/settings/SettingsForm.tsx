"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { updateProfile, deleteAccount } from "./actions";

interface SettingsFormProps {
  initialName: string;
  initialEmail: string;
}

export default function SettingsForm({ initialName, initialEmail }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Profile Update Form Handler
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        setFeedback({ type: "success", message: result.message || "Changes saved!" });
        router.refresh();
      } else {
        setFeedback({ type: "error", message: result.error || "Something went wrong." });
      }
    });
  };

  // Safe Account Deletion Handler
  const handleDelete = async () => {
    const confirmed = window.confirm("CRITICAL WARNING: Are you absolutely sure you want to delete your account? This action is permanent and deletes all order history.");
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      router.push("/login");
      router.refresh();
    } else {
      setFeedback({ type: "error", message: "Failed to delete account configuration." });
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* PROFILE UPDATE FORM */}
      <form onSubmit={handleUpdate} className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profile Information</h3>

        {feedback && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
              : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30"
          }`}>
            {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {feedback.message}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</label>
          <input type="text" name="name" defaultValue={initialName} required className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors shadow-sm" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</label>
          <input type="email" name="email" defaultValue={initialEmail} required className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors shadow-sm" />
        </div>

        <button type="submit" disabled={isPending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wide transition-colors shadow-sm flex items-center gap-2">
          {isPending && <Loader2 size={14} className="animate-spin" />}
          Save Profile Preferences
        </button>
      </form>

      {/* DANGER ZONE */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-red-100 dark:border-red-950/30 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
          <ShieldAlert size={20} /> Danger Zone
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Deleting your profile is instant and irreversible. Your open checkout history logs, active marketplace reviews, and session assets will be fully dropped.
        </p>
        <button type="button" onClick={handleDelete} disabled={isDeleting} className="w-full py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-xs font-bold transition-colors border border-rose-100 dark:border-rose-900/40">
          {isDeleting ? "Wiping Node..." : "Deactivate Account Profile"}
        </button>
      </div>
    </div>
  );
}
