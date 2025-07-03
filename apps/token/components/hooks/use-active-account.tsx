'use client';
import {
  useActiveAccount as useActiveAccountThirdweb,
  useActiveWalletConnectionStatus,
} from 'thirdweb/react';

function useActiveAccount() {
  const activeAccount = useActiveAccountThirdweb();
  const status = useActiveWalletConnectionStatus();

  return { activeAccount, status };
}

export default useActiveAccount;
