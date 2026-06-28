"use client"

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, Layers, Globe, ShieldCheck } from 'lucide-react';
// Import brand icons explicitly from Font Awesome 6 via react-icons
import { FaGithub, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300 mt-24">
      {/* PRIMARY FOOTER LINKING MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

        {/* COLUMN 1: PLATFORM IDENTITY SUMMARY */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/10">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <span className="font-black tracking-tight text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              nex<span className="text-indigo-600 dark:text-indigo-400">mart</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm font-medium">
            A high-performance multi-vendor marketplace engine designed for next-generation hardware pipelines, decentralized inventory, and ultra-fast customer checkout fulfillment.
          </p>

          {/* Brand Connections using React-Icons */}
          <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="X Profile">
              <FaXTwitter size={16} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="GitHub Repository">
              <FaGithub size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn Profile">
              <FaLinkedinIn size={17} />
            </a>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <span className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-help" title="Infrastructure Layers">
              <Layers size={16} />
            </span>
          </div>
        </div>

        {/* COLUMN 2: MARKETPLACE DIRECTORIES */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-black uppercase tracking-widest font-mono text-gray-400 dark:text-gray-500">
            Marketplace
          </h5>
          <ul className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
            <li><Link href="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Products</Link></li>
            <li><Link href="/shop?featured=true" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Featured Assets</Link></li>
            <li><Link href="/stores" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Merchant Directory</Link></li>
            <li><Link href="/reviews" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Platform Reviews</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: VENDOR MERCHANDISING */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-black uppercase tracking-widest font-mono text-gray-400 dark:text-gray-500">
            Supply Chain
          </h5>
          <ul className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
            <li><Link href="/dashboard/seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Merchant Studio</Link></li>
            <li><Link href="/register-store" className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Store size={14} /> Open a Storefront</Link></li>
            <li><Link href="/licensing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Vendor Guidelines</Link></li>
            <li><Link href="/api-docs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Developer Core API</Link></li>
          </ul>
        </div>

        {/* COLUMN 4: SYSTEM NEWSLETTER SUITE */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-black uppercase tracking-widest font-mono text-gray-400 dark:text-gray-500">
            Telemetry Updates
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-medium">
            Subscribe to receive automated notifications regarding inventory restocks and core firmware patches.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="system@domain.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-xs font-mono font-medium text-gray-900 dark:text-white placeholder-gray-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-950 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white text-[10px] font-black uppercase tracking-wider shadow-sm transition-all"
              >
                Sync
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* COMPLIANCE & LEGAL BASES SEGMENT */}
      <div className="border-t border-gray-100 dark:border-gray-900/60 bg-gray-50/40 dark:bg-gray-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-gray-400 dark:text-gray-500">

          <div className="flex items-center gap-1.5 font-mono">
            <span>&copy; {currentYear} NEXUSHUB INC. ALL METRICS ACTIVE.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
              <ShieldCheck size={12} className="text-indigo-500/80" /> Privacy & Terms
            </Link>
            <Link href="/status" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
              <Globe size={12} className="text-emerald-500/80" /> Cluster Status: Operational
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
