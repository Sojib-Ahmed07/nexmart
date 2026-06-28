import React from 'react';

export default function PartnersCarousel() {
  const customLogos = [
    'https://cdn-icons-png.flaticon.com/128/5968/5968764.png',
    'https://cdn-icons-png.flaticon.com/128/0/747.png',
    'https://cdn-icons-png.flaticon.com/128/281/281764.png',
    'https://cdn-icons-png.flaticon.com/128/5969/5969211.png',
    'https://cdn-icons-png.flaticon.com/128/10096/10096351.png',
    'https://cdn-icons-png.flaticon.com/128/733/733609.png',
    'https://cdn-icons-png.flaticon.com/128/5969/5969226.png',
  ];

  // Tripled to ensure a completely seamless continuous horizontal scrolling track
  const extendedPartners = [...customLogos, ...customLogos, ...customLogos];

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-16 border-y border-gray-100 dark:border-gray-900/60 transition-colors duration-200">

      {/* PERFECTLY BOUNDED CONTAINMENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MATCHED SECTION HEADER */}
        <div className="mb-12">
          <h2 className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-mono block">
            Ecosystem Node Network
          </h2>
        </div>

        {/* BOUNDED ALIGNED RUNWAY TRACK CONTAINER */}
        <div className="relative flex w-full items-center overflow-hidden rounded-[2.5rem]">

          {/* Fading Edge Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

          {/* MARQUEE LOOPER TRACK WITH EXPANDED SPACING */}
          <div className="flex gap-28 animate-marquee whitespace-nowrap items-center py-4">
            {extendedPartners.map((logoUrl, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center h-20 w-20 shrink-0 group transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={logoUrl}
                  alt="Ecosystem platform partner asset"
                  className="max-h-full max-w-full object-contain transition-opacity duration-300 opacity-85 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
