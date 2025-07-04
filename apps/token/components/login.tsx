'use client';

import { cn } from '@mjs/ui/lib/utils';
//
import { ConnectWalletThirdweb } from './connect-wallet';

export function LoginForm({ className }: { className?: string }) {
  return (
    <div className={cn(className)}>
      <ConnectWalletThirdweb />
    </div>
  );
}
