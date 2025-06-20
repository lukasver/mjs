import Image from 'next/image';
import MahjongStarsLogo from '@/public/static/images/logo-wt.webp';
import { cn } from '@mjs/ui/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <figure className={cn(className, 'dark:bg-none')}>
      <Image
        alt='Mahjong Stars Logo'
        {...MahjongStarsLogo}
        height={80}
        width={100}
        priority
      />
    </figure>
  );
};
