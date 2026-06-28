import React from 'react';
import { Package, AlertCircle, Clock } from 'lucide-react';
import { getSellerProducts } from './actions';
import ProductForm from './ProductForm';

export default async function SellerProductsPage() {
  const { products, categories, storeId, isApproved } = await getSellerProducts();

  if (!isApproved) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in duration-300">
        <Clock className="h-12 w-12 text-amber-500 dark:text-amber-400 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory System Locked</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
          You are not permitted to manage product items or register listings until your store instance status has been validated and activated by an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Product Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your store items, change stock levels, and add listings to the global marketplace catalog.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: THE PRODUCTS LIST INDEX */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Catalog Items</h3>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
              <Package className="h-8 w-8 text-gray-300 dark:text-gray-700" />
              Your product catalog is empty. Form a new listing item using the panel workspace.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="py-3 px-6">Product Item</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-800"
                          />
                          <div className="flex flex-col overflow-hidden max-w-[150px] sm:max-w-xs">
                            <span className="text-gray-900 dark:text-white font-semibold truncate">{product.name}</span>
                            <span className="text-xs text-gray-400 font-mono truncate">{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900 dark:text-white font-bold">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                        }`}>
                          {product.stock} left in stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RENDER MODULAR CLIENT FORM */}
        <div>
          {!storeId ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Resolve storefront application steps first.
            </div>
          ) : (
            <ProductForm categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}
