'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const ClientCartProvider = dynamic(() => import('./context/ClientCartProvider'), { ssr: false });

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ClientCartProvider>
      <ClerkProvider 
        appearance={{
          baseTheme: dark,
        }}
      >
        {children}
      </ClerkProvider>
    </ClientCartProvider>
  );
}