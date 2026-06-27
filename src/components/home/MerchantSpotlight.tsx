import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface MerchantSpotlightProps {
  stores: Store[];
}

export default function MerchantSpotlight({ stores }: MerchantSpotlightProps) {
  if (stores.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stores.map((store) => (
        <div key={store.id} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-gray-900 dark:text-white text-lg truncate">{store.name}</h4>
              <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 size={14} />
              </span>
            </div>
            <span className="text-xs font-mono text-gray-400 block">/{store.slug}</span>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500 dark:text-gray-400">
              {store._count.products}
            </span>
            <Link href={`/store/${store.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
              ➔
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
