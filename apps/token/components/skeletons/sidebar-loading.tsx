import { Skeleton } from '@mjs/ui/primitives/skeleton';

export function SidebarLoading() {
  return (
    <div className='w-64 bg-card border-r border-border p-4 space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-16' />
        <div className='space-y-1'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-6 w-24 ml-4' />
          <Skeleton className='h-6 w-16 ml-4' />
          <Skeleton className='h-6 w-28 ml-4' />
        </div>
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-12' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-16' />
        <Skeleton className='h-8 w-28' />
      </div>
    </div>
  );
}
