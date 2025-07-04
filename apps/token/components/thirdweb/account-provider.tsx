'use client';

import React, { useTransition } from 'react';
import useActiveAccount from '../hooks/use-active-account';
import {
  AccountProvider as AccountProviderThirdweb,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@mjs/ui/primitives/alert-dialog';
import { ConnectWalletThirdweb } from '../connect-wallet';
import { Icons } from '@mjs/ui/components/icons';
import { Button } from '@mjs/ui/primitives/button';
import { logout } from '../../lib/actions';
import { client } from '@/lib/auth/thirdweb-client';

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { activeAccount, status } = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    startTransition(async () => {
      if (wallet) {
        disconnect(wallet);
      }
      await logout();
    });
  };

  if (status === 'disconnected') {
    return (
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='flex items-center justify-between gap-2'>
              <AlertDialogTitle className='flex-1'>
                Please connect your wallet
              </AlertDialogTitle>
              <Button
                variant='ghost'
                size='icon'
                tabIndex={-1}
                onClick={handleClose}
                loading={isPending}
              >
                <Icons.x className='w-4 h-4' />
              </Button>
            </div>
            {/* <AlertDialogDescription>Lorem</AlertDialogDescription> */}
          </AlertDialogHeader>
          <ConnectWalletThirdweb />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (status === 'unknown' || status === 'connecting') {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Connecting...</AlertDialogTitle>
            <AlertDialogDescription>Please wait</AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex items-center justify-center h-full w-full'>
            <Icons.loader className='w-10 h-10 animate-spin' />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (activeAccount) {
    return (
      <AccountProviderThirdweb address={activeAccount.address} client={client}>
        {children}
      </AccountProviderThirdweb>
    );
  }

  if (status === 'connected') {
    return (
      <div className='h-screen w-screen grid place-items-center'>
        <Icons.loader className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  return null;
}

export default AccountProvider;
