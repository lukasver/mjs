import { Skeleton } from '@mjs/ui/primitives/skeleton';

export function MetricCardsLoading({ length = 4 }: { length?: number }) {
  return (
    <div className='grid grid-cols-4 gap-6'>
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className='bg-card rounded-lg p-4 space-y-2 border border-border'
        >
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-8 w-16' />
        </div>
      ))}
    </div>
  );
}
