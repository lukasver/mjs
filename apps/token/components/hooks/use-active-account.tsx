'use client';
import { logout } from '@/lib/actions';
import { useCallback, useTransition } from 'react';
import {
  useActiveAccount as useActiveAccountThirdweb,
  useActiveWalletConnectionStatus,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';

function useActiveAccount() {
  const ac = useActiveAccountThirdweb();
  const status = useActiveWalletConnectionStatus();
  const wallet = useActiveWallet();

  // const { data: profiles } = useProfiles({
  //   client,
  // });

  const { disconnect } = useDisconnect();
  const [isPending, startTransition] = useTransition();

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
  };
}

export default useActiveAccount;
