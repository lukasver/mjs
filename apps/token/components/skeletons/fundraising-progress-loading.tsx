import { Skeleton } from '@mjs/ui/primitives/skeleton';

export function FundraisingProgressLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-5 w-48' />
      </div>

      <div className='space-y-4'>
        <div className='flex items-end gap-2'>
          <Skeleton className='h-12 w-48' />
          <Skeleton className='h-6 w-24' />
          <div className='ml-auto'>
            <Skeleton className='h-8 w-12' />
          </div>
        </div>
        <Skeleton className='h-3 w-full rounded-full' />
      </div>
    </div>
  );
}
