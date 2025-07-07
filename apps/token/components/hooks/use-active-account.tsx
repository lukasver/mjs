'use client';
import { logout } from '@/lib/actions';
import { useCallback, useTransition } from 'react';
import {
  useActiveAccount as useActiveAccountThirdweb,
  useActiveWalletConnectionStatus,
  useActiveWallet,
  useDisconnect,
  useProfiles,
} from 'thirdweb/react';
import { useUser } from './use-user';
import { client } from '@/lib/auth/thirdweb-client';

function useActiveAccount() {
  const ac = useActiveAccountThirdweb();
  const status = useActiveWalletConnectionStatus();
  const wallet = useActiveWallet();

  const { data: profiles } = useProfiles({
    client,
  });

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
    activeAccount: ac,
    status,
    isLoading: isPending || status === 'connecting',
    isConnected: status === 'connected',
    signout,
    user: user || null,
  };
}

export default useActiveAccount;
