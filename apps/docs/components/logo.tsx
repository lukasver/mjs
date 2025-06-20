import Image from 'next/image';
import MahjongStarsLogo from '@/public/static/images/logo-wt.webp';
import { cn } from '@mjs/ui/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <figure className={cn(className, 'bg-amber-600! dark:bg-none')}>
      <Image
        src={MahjongStarsLogo}
        alt='Mahjong Stars Logo'
        width={100}
        height={100}
      />
      <h2 className='text-2xl font-bold text-blue-400'>Mahjong Stars</h2>
    </figure>
  );
};
