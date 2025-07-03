'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { ThirdwebProvider } from 'thirdweb/react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThirdwebProvider>
  );
}
