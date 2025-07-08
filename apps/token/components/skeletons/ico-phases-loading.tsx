import { Skeleton } from '@mjs/ui/primitives/skeleton';

export function IcoPhasesLoading() {
  return (
    <div className='bg-card rounded-lg p-6 space-y-4 border border-border'>
      <div className='space-y-2'>
        <Skeleton className='h-6 w-28' />
        <Skeleton className='h-4 w-44' />
      </div>
      <div className='space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='space-y-2'>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-12' />
            </div>
            <Skeleton className='h-2 w-full rounded-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
