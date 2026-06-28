"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { Plus, ShoppingBag, ImageUp, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { createProduct, uploadImageToServer } from './actions';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    const res = await uploadImageToServer(uploadData);
    setIsUploading(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setErrorMsg(res.error || "File upload failed.");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setErrorMsg('');

    if (imageUrl) {
      formData.set("imageUrl", imageUrl);
    }

    const res = await createProduct(formData);
    setIsPending(false);

    if (res?.success) {
      formRef.current?.reset();
      setImageUrl('');
    } else if (res?.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Create New Listing
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Provision additional stock lines instantly.</p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30">
          {errorMsg}
        </div>
      )}

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Product Title Name</label>
          <input required type="text" name="name" placeholder="Mechanical Keyboards..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors shadow-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Price (USD)</label>
            <input required type="number" step="0.01" min="0.01" name="price" placeholder="99.99" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Stock Count</label>
            <input required type="number" min="1" name="stock" placeholder="25" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors shadow-sm" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Global Category Binding</label>
          <select required name="categoryId" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-600 transition-colors shadow-sm cursor-pointer">
            <option value="" className="text-gray-400">Select a category mapping...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">{cat.name}</option>
            ))}
          </select>
        </div>

        {/* SECURE INTERNAL FILE UPLOADER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Product Image Asset</label>
          <input type="hidden" name="imageUrl" value={imageUrl} />

          {!imageUrl ? (
            <label className="w-full py-6 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500 bg-gray-50/50 dark:bg-gray-950/20 text-gray-500 dark:text-gray-400 transition-all group cursor-pointer relative">
              {isUploading ? (
                <>
                  <Loader2 size={20} className="text-indigo-500 animate-spin" />
                  <span className="text-xs font-semibold text-indigo-500">Uploading to Cloudinary server...</span>
                </>
              ) : (
                <>
                  <ImageUp size={20} className="group-hover:scale-110 text-gray-400 group-hover:text-indigo-500 transition-transform" />
                  <span className="text-xs font-semibold">Choose physical image asset</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </label>
          ) : (
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-3 bg-gray-50/40 dark:bg-gray-950/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={imageUrl} alt="Upload thumb preview" className="h-12 w-12 rounded-lg object-cover border dark:border-gray-800" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Ready
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">{imageUrl}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Item Copy/Description</label>
          <textarea rows={3} name="description" placeholder="Specify layout details..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none transition-colors shadow-sm resize-none" />
        </div>

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> {isPending ? "Syncing Database Entry..." : "Deploy Product Entry"}
        </button>
      </form>
    </div>
  );
}
