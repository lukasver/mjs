import { RainbowButton } from '@mjs/ui/components/rainbow-button';
import { cn } from '@mjs/ui/lib/utils';

export async function BuyTokenButton({ className }: { className?: string }) {
  //TODO! fetch data of open sale token to buy
  return (
    <RainbowButton
      className={cn(
        'font-head border-2 shadow-sm border-solid bg-accent rounded-xl h-full hover:bg-accent/80 transition-all duration-300 hover:scale-105 hover:animate-pulse',
        className
      )}
    >
      Buy $MJS
    </RainbowButton>
  );
}
