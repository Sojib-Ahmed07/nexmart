"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Explicit Cart item structural layout
export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  storeId: string;
  storeName: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate cart from localStorage safely on runtime client initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('nexmart_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart hydration crash:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // 2. Persist state changes back to disk storage (only after hydration is complete)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('nexmart_cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      return prevCart.filter((item) => item.id !== id);
    });
  };

  // 3. Cached function reference to prevent infinite render loops downstream 🎯
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be executed within a CartProvider boundary shell.");
  return context;
}
