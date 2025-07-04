'use client';
import { logout } from '@/lib/actions';
import { useCallback, useTransition } from 'react';
import {
  useActiveAccount as useActiveAccountThirdweb,
  useActiveWalletConnectionStatus,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import { useUser } from './use-user';

function useActiveAccount() {
  const activeAccount = useActiveAccountThirdweb();
  const status = useActiveWalletConnectionStatus();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isPending, startTransition] = useTransition();
  const { data: user } = useUser({
    staleTime: 1000,
    enabled: status === 'connected',
  });

  const signout = useCallback(() => {
    startTransition(async () => {
      if (wallet) {
        disconnect(wallet);
      }
      await logout();
    });
  }, [wallet, disconnect]);

  return {
    activeAccount,
    status,
    isLoading: isPending || status === 'connecting',
    isConnected: status === 'connected',
    signout,
    user: user || null,
  };
}

export default useActiveAccount;
