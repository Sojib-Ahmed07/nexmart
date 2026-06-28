import React from 'react';
import { Zap, ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';

export default function FeaturesGrid() {
  const points = [
    {
      icon: <Zap className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />,
      title: "Ultra-Low Latency Checkout",
      description: "Powered by Next.js PPR and Edge computing nodes to deliver instantaneous item transit execution under 40ms.",
      accent: "from-indigo-500/20 to-cyan-500/0"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      title: "Isolated Node Security",
      description: "Cryptographically secured transaction pipelines featuring multi-role state checks and secure session layer validation.",
      accent: "from-emerald-500/20 to-teal-500/0"
    },
    {
      icon: <Globe className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Global Supply Architecture",
      description: "Decentralized fulfillment interfaces distributing logistics routing paths across all tier-1 regional warehouses dynamically.",
      accent: "from-amber-500/20 to-orange-500/0"
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-mono mb-3">
            Core Infrastructure Matrix
          </h2>
          <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Engineered for high-throughput digital commerce.
          </p>
        </div>

        {/* INTERACTIVE BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-900 rounded-[2rem] p-8 hover:shadow-xl hover:shadow-indigo-500/[0.02] dark:hover:shadow-none transition-all duration-300 flex flex-col justify-between min-h-[260px]"
            >
              {/* Gradient Radial Backglow on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Top Meta Details */}
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/50 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-indigo-500/30 dark:group-hover:border-indigo-400/30 transition-all duration-300">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                  {item.description}
                </p>
              </div>

              {/* Interactive Corner Arrow indicator */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold font-mono tracking-wide text-gray-400 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                <span>EXPLORE NODE</span>
                <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
