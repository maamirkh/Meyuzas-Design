'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';

export default function ClientCartProvider({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
