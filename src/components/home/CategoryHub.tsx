import React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryHubProps {
  categories: Category[];
}

export default function CategoryHub({ categories }: CategoryHubProps) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop?category=${cat.slug}`}
          className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start gap-4 text-center md:text-left"
        >
          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {cat.name}
            </h4>
            <span className="text-[11px] font-mono text-gray-400 block mt-0.5">/{cat.slug}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
