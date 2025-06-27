import { cn } from '@mjs/ui/lib/utils';
import { Skeleton } from '@mjs/ui/primitives/skeleton';
import { ChevronDown } from 'lucide-react';

export default function FaqLoading() {
  return (
    <div className='min-h-screen bg-transparent text-white relative'>
      {/* Background pattern overlay (subtle mahjong tiles) */}
      <div
        className='absolute inset-0 opacity-10 pointer-events-none'
        aria-hidden='true'
      >
        {/* This would be where the background pattern would go */}
      </div>

      {/* Navigation */}
      <header className='container mx-auto px-4 py-4 flex items-center justify-between h-[90px]' />

      {/* Main content */}
      <main className='container-narrow mx-auto px-4 py-16'>
        {/* Main heading */}
        <div className='text-left mb-8'>
          <Skeleton className='h-12 w-2/4 bg-red-800 mb-6' />
          <Skeleton className='h-6 w-2/3 bg-secondary-300' />
        </div>

        {/* FAQ items */}
        <div className='w-full space-y-4 mt-16'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className='border-b border-black pb-4 h-14 flex items-center w-full'
            >
              <div className='flex items-center justify-between flex-1'>
                <Skeleton className='h-8 w-3/4 bg-red-800' />
                <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
              </div>
            </div>
          ))}
        </div>
      </main>
      <div
        className={cn(
          'w-full h-full absolute inset-0 bg-repeat -z-1 bg-[url(/static/images/bg2.webp)]',
          'gradient-y-primary',
          'after:absolute after:inset-0 after:bg-gradient-to-t after:from-primary/80 after:from-5% after:to-transparent'
        )}
      />
    </div>
  );
}
