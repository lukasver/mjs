'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type React from 'react';
import { ThirdwebProvider } from 'thirdweb/react';

import { SidebarProvider } from '@mjs/ui/primitives/sidebar';

import AccountProvider from '@/components/thirdweb/account-provider';
import AutoConnect from '@/components/thirdweb/autoconnect';

import { TokenProvider } from '@/components/thirdweb/token-provider';
import { SyncConnectedWallet } from '@/components/sync-wallets';

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThirdwebProvider>
  );
}

export function PagesProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AutoConnect />
      <SyncConnectedWallet>
        <AccountProvider>
          <TokenProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </TokenProvider>
        </AccountProvider>
      </SyncConnectedWallet>
    </>
  );
}
