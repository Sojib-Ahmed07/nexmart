"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const slides = [
    {
      image: "https://www.startech.com.bd/image/cache/catalog/monitor/aoc/agon-pro-ag276qkd/agon-pro-ag276qkd-001-500x500.webp",
    },
    {
      image: "https://www.startech.com.bd/image/cache/catalog/laptop/lenovo/ideapad-1-15amn7/ideapad-1-15amn7-001-500x500.webp",
    },
    {
      image: "https://www.startech.com.bd/image/cache/catalog/mobile/apple/iphone-17-pro/iphone-17-pro-silver-official-01-500x500.webp",
    },
    {
      image: "https://www.startech.com.bd/image/cache/catalog/graphics-card/nvidia/rtx-pro-6000-blackwell-workstation-edition/rtx-pro-6000-blackwell-workstation-edition-01-500x500.webp",
    }
  ];

  return (
    <div className="relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* VIEWPORT WRAPPER */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100/70 dark:from-gray-900 dark:to-gray-950 shadow-md" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 sm:p-12 lg:p-16 relative">

              {/* LEFT COLUMN: BRAND ACTIONS */}
              <div className="space-y-6 order-2 md:order-1 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <Link href="/shop" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all hover:shadow flex items-center gap-2">
                    Explore Catalog <ArrowRight size={16} />
                  </Link>
                  <Link href="/dashboard/seller" className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                    Become a Vendor
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: STATIC IMAGES */}
              <div className="order-1 md:order-2 flex justify-center items-center relative min-h-[250px] sm:min-h-[350px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/0 dark:from-indigo-500/5 dark:to-transparent blur-3xl rounded-full transform scale-75" />
                <img
                  src={slide.image}
                  alt="Marketplace Highlight Asset"
                  className="max-h-[260px] sm:max-h-[360px] w-auto object-contain drop-shadow-2xl dark:brightness-95 transform hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 backdrop-blur shadow-sm hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all z-10 hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 backdrop-blur shadow-sm hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all z-10 hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
