import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Store, ShieldCheck, Truck } from 'lucide-react';
import { getProductDetailsBySlug } from '../actions';
import AddToCartButton from './AddToCartButton';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const rawProduct = await getProductDetailsBySlug(resolvedParams.slug);

  // If the customer attempts to query a broken slug namespace, throw an immediate 404 block response
  if (!rawProduct) {
    notFound();
  }

  // Sanitize the product data securely into plain primitives before streaming it to Client Components
  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    description: rawProduct.description,
    price: Number(rawProduct.price), // Securely map decimal object out into a plain JS number
    images: rawProduct.images,
    stock: rawProduct.stock,
    storeId: rawProduct.storeId,
    category: rawProduct.category ? { name: rawProduct.category.name } : null,
    store: rawProduct.store ? { name: rawProduct.store.name } : null,
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* BACK TO BROWSE INDEX BUTTON */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>

        {/* CORE PRODUCT WORKSPACE SHELL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-900 p-6 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm items-start">

          {/* LEFT CONTAINER: MEDIA FRAME */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* RIGHT CONTAINER: METADATA DETAILS COMPONENT */}
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">

              {/* Parent Category Trace Chip */}
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 text-xs font-semibold tracking-wide">
                {product.category?.name || "Marketplace"}
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {product.name}
              </h1>

              {/* Vendor Owner Node Card */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Store className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Fulfilled and Sold By</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate block">
                    {product.store?.name || "Verified Merchant"}
                  </span>
                </div>
              </div>

              {/* Pricing Metric Block */}
              <div className="pt-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{formattedPrice}</span>
                <span className="text-xs font-semibold text-gray-400 block mt-1">Local processing fees & tax applied at split execution.</span>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Specification Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description || "The merchant has not provided custom technical copy fields for this inventory listing block item."}
                </p>
              </div>
            </div>

            {/* LOWER PURCHASE INTERFACE RENDER COMPONENT */}
            <div className="space-y-4 pt-6">

              {/* Inventory Stock Indicator Badge */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                {product.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    In Stock ({product.stock} units ready to distribute)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400">Out of stock at this vendor location</span>
                )}
              </div>

              {/* Add to Cart Control Button Trigger */}
              <AddToCartButton
                product={product}
                storeName={product.store?.name || "Verified Merchant"}
              />

              {/* Platform Logistics Protection Claims */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-indigo-500" /> Multi-vendor Unified Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Safe Merchant Pay Escrow
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
