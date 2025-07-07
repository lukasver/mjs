'use client';

import {
  TokenProvider as TokenProviderThirdweb,
  useActiveWalletChain,
} from 'thirdweb/react';
import { client } from '@/lib/auth/thirdweb-client';
import { useSales } from '../hooks/use-sales';

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const chain = useActiveWalletChain();
  const sale = useSales({ active: true });

  return (
    <TokenProviderThirdweb
      address={sale?.data?.sales[0]?.tokenContractAddress || ''}
      client={client}
      chain={chain}
    >
      {children}
    </TokenProviderThirdweb>
  );
};
