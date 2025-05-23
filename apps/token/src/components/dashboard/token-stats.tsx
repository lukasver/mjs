import { ArrowDown, ArrowUp } from 'lucide-react';
import { GlassyCard } from '@mjs/ui/components/cards';

export function TokenStats() {
  return (
    <>
      <GlassyCard title='Token Price' icon='dollar'>
        <div className='text-2xl font-bold'>$0.50</div>
        <p className='text-xs text-secondary-400'>+2.5% from last period</p>
        <div className='mt-4 flex items-center gap-2 text-xs text-green-500'>
          <ArrowUp className='h-3 w-3' />
          <span>4.3%</span>
          <span className='text-secondary-400'>vs last 24h</span>
        </div>
      </GlassyCard>

      <GlassyCard title='Market cap' icon='dollar'>
        <div className='text-2xl font-bold'>$5.2M</div>
        <p className='text-xs text-secondary-400'>Fully diluted: $10M</p>
        <div className='mt-4 flex items-center gap-2 text-xs text-red-500'>
          <ArrowDown className='h-3 w-3' />
          <span>1.2%</span>
          <span className='text-secondary-400'>vs last 24h</span>
        </div>
      </GlassyCard>

      <GlassyCard title='Total Holders' icon='users'>
        <div className='text-2xl font-bold'>1,245</div>
        <p className='text-xs text-secondary-400'>+123 new holders this week</p>
        <div className='mt-4 flex items-center gap-2 text-xs text-green-500'>
          <ArrowUp className='h-3 w-3' />
          <span>10.8%</span>
          <span className='text-secondary-400'>vs last week</span>
        </div>
      </GlassyCard>
    </>
  );
}
