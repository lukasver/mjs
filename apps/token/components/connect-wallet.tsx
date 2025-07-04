'use client';
import { bscTestnet, sepolia } from 'thirdweb/chains';
import { ConnectButton } from 'thirdweb/react';
import { metadata } from '../common/config/site';
import { Wallet } from 'thirdweb/wallets';
import { wallets } from '@/lib/auth/wallets';
import {
  isLoggedIn,
  doLogin,
  getLoginPayload,
  doLogout,
} from '@/lib/auth/functions';
import { client } from '@/lib/auth/thirdweb-client';

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
        isLoggedIn,
        doLogin,
        getLoginPayload,
        doLogout,
      }}
    />
  );
};
