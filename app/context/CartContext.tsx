'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCartItems } from '../../actions/actions';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const items = getCartItems();
      return items.reduce((total, item) => total + item.inventory, 0);
    }
    return 0;
  });

  const updateCartCount = () => {
    const items = getCartItems();
    const totalItems = items.reduce((total, item) => total + item.inventory, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    // Listen for storage changes to update cart count across tabs
    const handleStorageChange = () => {
      updateCartCount();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}