import { env } from '@/common/config/env';
import { metadata } from '@/common/config/site';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  sepolia,
  optimism,
  arbitrum,
  base,
  polygon,
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: metadata.businessName,
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
