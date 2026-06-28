"use client";

import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const slides = [
    {
      badge: "Next-Gen Display",
      badgeIcon: Sparkles,
      title: "Immersive Visual Masterpiece",
      subtitle: "AOC Agon Pro OLED Edition",
      description:
        "Experience hyper-fast refresh performance profiles with unparalleled high-contrast color accuracy tailored for studio deployments.",
      image:
        "https://www.startech.com.bd/image/cache/catalog/monitor/gigasonic/gs-215fhd500s9/gs-215fhd500s9-black-01-500x500.webp",
      tag: "240Hz OLED",
    },
    {
      badge: "Ultralight Compute",
      badgeIcon: Zap,
      title: "Engineered For Peak Agility",
      subtitle: "Lenovo IdeaPad Premium Asset",
      description:
        "Unchain productivity parameters using the latest lightweight multi-threaded configuration architecture.",
      image:
        "https://www.startech.com.bd/image/cache/catalog/laptop/lenovo/ideapad-1-15amn7/ideapad-1-15amn7-001-500x500.webp",
      accent: "from-purple-600/20 to-pink-600/0",
      tag: "AMD Ryzen",
    },
    {
      badge: "Mobile Vanguard",
      badgeIcon: ShieldCheck,
      title: "Titanium Chassis Evolution",
      subtitle: "Apple iPhone 17 Pro Max",
      description:
        "Step into deep integration architecture featuring advanced continuous array image processing technology options.",
      image:
        "https://www.startech.com.bd/image/cache/catalog/mobile/apple/iphone-17-pro/iphone-17-pro-silver-official-01-500x500.webp",
      accent: "from-amber-600/20 to-orange-600/0",
      tag: "A19 Bionic",
    },
    {
      badge: "Compute Heavyweight",
      badgeIcon: Sparkles,
      title: "Unrivaled Render Matrix Power",
      subtitle: "NVIDIA RTX Pro Blackwell GPU",
      description:
        "Deploy maximum workstation execution capabilities for deep mathematical transformations and neural array generation tasks.",
      image:
        "https://www.startech.com.bd/image/cache/catalog/graphics-card/nvidia/rtx-pro-6000-blackwell-workstation-edition/rtx-pro-6000-blackwell-workstation-edition-01-500x500.webp",
      accent: "from-emerald-600/20 to-teal-600/0",
      tag: "Blackwell Core",
    },
  ];

  return (
    <div className="relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* MAIN VIEWPORT CAROUSEL CONSOLE */}
      <div
        className="overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)]"
        ref={emblaRef}
      >
        <div className="flex">
          {slides.map((slide, index) => {
            const BadgeIcon = slide.badgeIcon;
            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-12 p-8 sm:p-12 lg:p-20 relative overflow-hidden"
              >
                {/* DYNAMIC BACKDROP LIGHT SHIELD */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-60 pointer-events-none`}
                />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

                {/* TEXT DATA WRAP BLOCK */}
                <div className="md:col-span-7 space-y-6 order-2 md:order-1 text-center md:text-left relative z-10">
                  {/* METRIC HEAD TAG ROW */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm animate-fade-in">
                    <BadgeIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400 font-mono">
                      {slide.badge}
                    </span>
                    <span className="h-3 w-[1px] bg-gray-200 dark:bg-gray-700" />
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono px-1">
                      {slide.tag}
                    </span>
                  </div>

                  {/* DISPLAY TYPOGRAPHY HEADER */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      {slide.subtitle}
                    </h3>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                      {slide.title}
                    </h1>
                  </div>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
                    {slide.description}
                  </p>

                  {/* ACTION TRIGGER BUTTON SEGMENT */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                    <Link
                      href="/shop"
                      className="group/btn px-7 py-3.5 rounded-2xl bg-gray-900 hover:bg-indigo-600 dark:bg-white dark:hover:bg-indigo-500 text-white dark:text-gray-900 dark:hover:text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-indigo-500/20 transition-all duration-300 flex items-center gap-2.5"
                    >
                      Acquire Asset
                      <ArrowRight
                        size={14}
                        className="transform group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                    <Link
                      href="/dashboard/user/become-seller"
                      className="px-7 py-3.5 rounded-2xl border-2 border-gray-200/80 dark:border-gray-800 bg-transparent text-gray-800 dark:text-gray-200 text-xs font-black uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all duration-300"
                    >
                      Establish Vendor Node
                    </Link>
                  </div>
                </div>

                {/* IMAGERY ASSET RENDER SEGMENT */}
                <div className="md:col-span-5 order-1 md:order-2 flex justify-center items-center relative min-h-[260px] sm:min-h-[380px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/0 dark:from-indigo-400/10 dark:to-transparent blur-[80px] rounded-full transform scale-90 animate-pulse duration-[8000ms]" />

                  <div className="relative group/img">
                    <img
                      src={slide.image}
                      alt="Marketplace Highlight Hardware Asset"
                      className="max-h-[240px] sm:max-h-[340px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] dark:brightness-95 transform scale-100 hover:scale-105 hover:-rotate-2 transition-all duration-700 ease-out select-none pointer-events-none relative z-10"
                    />
                    {/* Ring glow under the product */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gray-900/5 dark:bg-black/40 blur-md rounded-full transform scale-x-75 pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPACT MATRIX DASH DOT NAVIGATION PANELS */}
        <div className="absolute bottom-12 left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-gray-900/5 dark:bg-white/5 backdrop-blur-md border border-white/10 shadow-inner">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                selectedIndex === index
                  ? "w-6 bg-gray-900 dark:bg-white"
                  : "w-1.5 bg-gray-900/30 dark:bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* TACTILE HARDWARE CHEVRON TRIGGERS */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:bg-gray-50 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1/4 transition-all duration-300 z-30 hidden lg:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:bg-gray-50 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 group-hover:translate-x-1/4 transition-all duration-300 z-30 hidden lg:block"
        aria-label="Next slide"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
