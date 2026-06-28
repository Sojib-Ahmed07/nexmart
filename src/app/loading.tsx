import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalAppLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="flex flex-col items-center space-y-4 p-8">

        {/* Spinning Utility Indicator */}
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600 dark:text-indigo-400" />

        <div className="space-y-1 text-center">
          <p className="text-xs font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase font-mono animate-pulse">
            Synchronizing workspace
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-600">
            Please wait while we establish downstream session routes...
          </p>
        </div>

      </div>
    </div>
  );
}
