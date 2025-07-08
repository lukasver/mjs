'use client';

import {
  TokenProvider as TokenProviderThirdweb,
  useActiveWalletChain,
} from 'thirdweb/react';
import { client } from '@/lib/auth/thirdweb-client';
import { useActiveSale } from '@/lib/services/api';

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const chain = useActiveWalletChain();
  const { data: activeSale } = useActiveSale();

  return (
    <TokenProviderThirdweb
      address={activeSale?.tokenContractAddress || ''}
      client={client}
      chain={chain}
    >
      {children}
    </TokenProviderThirdweb>
  );
};
