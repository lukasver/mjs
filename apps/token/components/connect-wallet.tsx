'use client';
import { client, wallets } from '../lib/auth/thirdweb/thirdweb';
import { bscTestnet, sepolia } from 'thirdweb/chains';
import { ConnectButton } from 'thirdweb/react';
import { metadata } from '../common/config/site';
import { generatePayload, isLoggedIn, login, logout } from '../lib/actions';
import { Wallet } from 'thirdweb/wallets';

const localeMapping = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ja: 'ja_JP',
  ko: 'ko_KR',
  // zh: 'zh_CN',
  // cn: 'zh_CN', // Chinese simplified (duplicate mapping)
  ru: 'ru_RU',
  pt: 'pt_BR',
  // it: 'it_IT',
} as const;

export const ConnectWalletThirdweb = ({
  locale,
  onConnect,
}: {
  locale?: keyof typeof localeMapping;
  onConnect?: (wallet: Wallet) => void;
}) => {
  const mappedLocale = locale ? localeMapping[locale] : 'en_US';

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      appMetadata={{
        name: metadata.businessName,
        url: metadata.siteUrl,
      }}
      connectButton={{ label: 'Connect' }}
      connectModal={{ size: 'compact' }}
      accountAbstraction={{
        chain: bscTestnet, // ethereum, // replace with the chain you want
        sponsorGas: false,
      }}
      autoConnect={false}
      locale={mappedLocale}
      onConnect={onConnect}
      chains={[bscTestnet, sepolia]}
      // For SIWE
      auth={{
        // The following methods run on the server (not client)!
        isLoggedIn: async () => {
          const authResult = await isLoggedIn();
          if (!authResult) return false;
          return true;
        },
        doLogin: async (params) => {
          await login(params);
        },
        getLoginPayload: async ({ address, chainId }) => {
          const data = (await generatePayload({ address, chainId }))?.data;
          if (!data) {
            throw new Error('Failed to generate payload');
          }
          return data;
        },
        doLogout: async () => {
          await logout();
        },
      }}
    />
  );
};
