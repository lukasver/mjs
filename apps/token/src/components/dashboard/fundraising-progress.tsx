import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { Progress } from '@mjs/ui/primitives/progress';

export function FundraisingProgress() {
  // In a real app, these would come from your API or blockchain data
  const raised = 3250000;
  const goal = 5000000;
  const percentage = Math.round((raised / goal) * 100);

  return (
    <Card className='border-zinc-800 bg-zinc-900/50'>
      <CardHeader>
        <CardTitle>Fundraising Progress</CardTitle>
        <CardDescription>Current ICO round ends in 14 days</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <div>
              <span className='text-2xl font-bold text-purple-400'>
                ${raised.toLocaleString()}
              </span>
              <span className='text-zinc-400'> / ${goal.toLocaleString()}</span>
            </div>
            <div className='text-right font-medium'>{percentage}%</div>
          </div>
          <Progress
            value={percentage}
            className='h-2 bg-zinc-800'
            indicatorClassName='bg-purple-500'
          />
        </div>

        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3'>
            <div className='text-sm font-medium text-zinc-400'>
              Contributors
            </div>
            <div className='text-xl font-bold'>1,245</div>
          </div>
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3'>
            <div className='text-sm font-medium text-zinc-400'>Tokens Sold</div>
            <div className='text-xl font-bold'>6.5M</div>
          </div>
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3'>
            <div className='text-sm font-medium text-zinc-400'>Remaining</div>
            <div className='text-xl font-bold'>3.5M</div>
          </div>
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3'>
            <div className='text-sm font-medium text-zinc-400'>Token Price</div>
            <div className='text-xl font-bold'>$0.50</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
