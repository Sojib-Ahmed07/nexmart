import React from 'react';
import { Plus, Package, AlertCircle, ShoppingBag } from 'lucide-react';
import { getSellerProducts, createProduct } from './actions';

export default async function SellerProductsPage() {
  const { products, categories, storeId } = await getSellerProducts();

  // Explicit Server Component Inline Submit Handler
  async function handleFormSubmit(formData: FormData) {
    "use server";
    if (!storeId) return;
    await createProduct(formData, storeId);
  }

  return (
    <div className="space-y-8">
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
              <Package className="h-8 w-8 text-gray-300" />
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
                            className="h-10 w-10 object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                          />
                          <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white font-semibold">{product.name}</span>
                            <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900 dark:text-white font-bold">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30'
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

        {/* RIGHT COLUMN: THE CREATION WORKSPACE FORM */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" /> Create New Listing
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Provision additional stock lines instantly.</p>
          </div>

          {!storeId ? (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Resolve storefront application steps first.
            </div>
          ) : (
            <form action={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Title Name</label>
                <input required type="text" name="name" placeholder="Mechanical Keyboards, Hoodies..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price (USD)</label>
                  <input required type="number" step="0.01" min="0.01" name="price" placeholder="99.99" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Stock Count</label>
                  <input required type="number" min="1" name="stock" placeholder="25" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Global Category Binding</label>
                <select required name="categoryId" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors">
                  <option value="" className="text-gray-400">Select a category mapping...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Image Asset URL (Optional)</label>
                <input type="url" name="imageUrl" placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Item Copy/Description</label>
                <textarea rows={3} name="description" placeholder="Specify dimension data, variants limits, or layout details..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors resize-none" />
              </div>

              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Deploy Product Entry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
