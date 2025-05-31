'use client';
import { Button } from '@mjs/ui/primitives/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { ConnectWalletButton } from './connect-wallet-button';
import { client, wallets } from '@/lib/thirdweb';
import { sepolia } from 'thirdweb/chains';
import { ConnectButton } from 'thirdweb/react';
import { metadata } from '@/common/config/site';

export const ConnectWallet = () => {
  const _wallet = useConnect();
  const account = useAccount();
  const router = useRouter();

  const isConnected = account.status === 'connected';

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <Card className='bg-transparent max-w-sm'>
      <CardHeader>
        <CardTitle>Connect to a wallet</CardTitle>
        <CardDescription>
          You can now connect to an external wallet. Click MetaMask if you'd
          like to use it — or click Continue to skip for now.
        </CardDescription>
      </CardHeader>
      {/* <CardContent>test</CardContent> */}
      <CardFooter className='flex gap-2 justify-between'>
        <Button
          variant='outline'
          className='flex-1'
          // disabled={isPending}
          type='button'
          onClick={() => router.push('/dashboard')}
        >
          Skip
        </Button>
        <ConnectWalletButton />
        {/* <Button
          variant='accent'
          className='flex-1'
          type='submit'
          // loading={isPending}
        >
          Connect
        </Button> */}
      </CardFooter>
    </Card>
  );
};

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

export const ConnectWallet2 = ({
  locale,
}: {
  locale?: keyof typeof localeMapping;
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
      connectModal={{ size: 'wide' }}
      accountAbstraction={{
        chain: sepolia, // ethereum, // replace with the chain you want
        sponsorGas: false,
      }}
      locale={mappedLocale}
      onConnect={(wallet) => {
        console.log('ACAAAA', wallet);
      }}
      // auth={{
      //   async doLogin(params) {
      //     // call your backend to verify the signed payload passed in params
      //   },
      //   async doLogout() {
      //     // call your backend to logout the user if needed
      //   },
      //   async getLoginPayload(params) {
      //     // call your backend and return the payload
      //   },
      //   async isLoggedIn() {
      //     // call your backend to check if the user is logged in
      //   },
      // }}
    />
  );
};
