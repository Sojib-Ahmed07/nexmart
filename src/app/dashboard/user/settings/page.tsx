import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Control your multi-tenant global account credentials and marketplace identity settings.
        </p>
      </div>

      {/* Render the unified interactive layout element block */}
      <SettingsForm
        initialName={session.user.name}
        initialEmail={session.user.email}
      />
    </div>
  );
}
