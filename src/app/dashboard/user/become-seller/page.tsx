import React from "react";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SellerApplicationForm from "./SellerApplicationForm";
import { Store, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function BecomeSellerApplicationPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  // Query existing tenant maps associated with this identity token
  const store = await prisma.store.findFirst({
    where: { userId: session.user.id }
  });

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-300 py-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Initialize Tenant Hub <Store className="h-6 w-6 text-indigo-600" />
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Deploy an isolated storefront workspace partition to manage catalog listings.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8">
        {!store ? (
          <SellerApplicationForm />
        ) : store.status === "PENDING" ? (
          <div className="text-center py-6 space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl w-fit mx-auto border border-amber-100/30">
              <ShieldAlert size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Pipeline Registration Pending</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                Your store configuration parameters are currently queued for administrative verification clearance.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/seller" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View Seller Control Dashboard ➔
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mx-auto border border-emerald-100/30">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Tenant Verified</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your store network node is active and cleared to publish inventory.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/seller" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors">
                Open Seller Terminal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
