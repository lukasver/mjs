'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWalletButton() {
  return (
    <div className='contents [&>div>button]:flex-grow'>
      <ConnectButton label='Connect' accountStatus='full' chainStatus='none' />
    </div>
  );
}
