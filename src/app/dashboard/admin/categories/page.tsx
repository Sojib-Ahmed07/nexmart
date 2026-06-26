import React from 'react';
import { Layers, Plus, Tag } from 'lucide-react';
import { getAdminCategories, createGlobalCategory } from './actions';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  async function handleForm(formData: FormData) {
    "use server";
    await createGlobalCategory(formData);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Global Categories <Layers className="h-7 w-7 text-indigo-600" />
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage system-wide taxomony and catalog categorization structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LIST VIEW */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active System Categories</h3>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No global categories defined yet. Use the creation pane to launch one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50/40 dark:hover:bg-gray-800/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{cat.slug}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CREATION FORM */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Category</h3>

          <form action={handleForm} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g., Electronics, Fitness..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Initialize Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
