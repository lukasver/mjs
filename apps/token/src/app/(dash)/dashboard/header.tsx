'use client';

import { SidebarTrigger } from '@mjs/ui/primitives/sidebar';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { ThemeSwitcher } from '@mjs/ui/components/theme-switcher';
import { Separator } from '@mjs/ui/primitives/separator';
import { RainbowButton } from '@mjs/ui/components/rainbow-button';

export function DashboardHeader() {
  return (
    <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-sm md:px-6 w-full'>
      <SidebarTrigger />
      <div className='flex items-center gap-2 lg:gap-4'></div>
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
        <Separator orientation='vertical' className='h-8' />
        <RainbowButton className='font-head border-2 shadow-sm border-solid bg-accent rounded-xl h-full hover:bg-accent/80 transition-all duration-300 hover:scale-105 hover:animate-pulse'>
          Buy $MJS
        </RainbowButton>
        <Separator orientation='vertical' className='h-8' />
        <ConnectWalletButton />
      </div>
    </header>
  );
}
