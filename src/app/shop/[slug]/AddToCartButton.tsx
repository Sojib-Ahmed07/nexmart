"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number; // Checked type safety parameters
    images: string[];
    storeId: string;
    stock: number;
  };
  storeName: string;
}

export default function AddToCartButton({ product, storeName }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || '',
      storeId: product.storeId,
      storeName: storeName,
    });
    alert(`Added "${product.name}" to global checkout cart mapping! 🚀`);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-2xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed cursor-pointer"
    >
      <ShoppingCart className="h-4 w-4" /> Add Item to Global Order Cart
    </button>
  );
}
