import React from 'react';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Skeleton structure element */}
        <div className="border-b border-gray-100 dark:border-gray-900 pb-6 space-y-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center" />
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded mt-2" />
        </div>

        {/* Products Grid Loading Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[360px]"
            >
              <div className="bg-gray-100 dark:bg-gray-800 aspect-square w-full" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-900">
                  <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
