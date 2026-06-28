import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nexmart",
  description: "Multi-vendor e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* GLOBAL TOP PROGRESS LOADING BAR INDICATOR */}
        <NextTopLoader
          color="#4f46e5"          // Matches your Indigo UI palette accents
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}      // Keeps the interface minimal without an ugly spinning circle
          easing="ease"
          speed={200}
          shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        />

        <CartProvider>
          <ThemeProvider>
            <Navbar />

            {/* The flex-1 layout property natively pushes your footer to the true bottom */}
            <main className="flex-1">
              {children}
            </main>

            {/* Renders global platform footer safely nested inside providers */}
            <Footer />

          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
