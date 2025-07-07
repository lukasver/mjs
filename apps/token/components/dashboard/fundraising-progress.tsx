'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { Progress } from '@mjs/ui/primitives/progress';
import { useSales } from '../hooks/use-sales';
import { DateTime } from 'luxon';

export function FundraisingProgress({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { data, isLoading, error } = useSales({ active: true });
  const activeSale = data?.sales[0];

  console.debug('🚀 ~ fundraising-progress.tsx:20 ~ activeSale:', activeSale);

  // In a real app, these would come from your API or blockchain data
  // const t = await getTranslations();
  const raised = 3250000;
  const goal = 5000000;
  const percentage = Math.round((raised / goal) * 100);

  if (!activeSale) return null;
  return (
    <Card className='border-zinc-800 bg-zinc-900/50'>
      <CardHeader>
        <CardTitle>{activeSale.name}</CardTitle>
        <CardDescription>
          Current ICO round ends in{' '}
          {Math.floor(
            DateTime.fromJSDate(activeSale.saleClosingDate).diffNow('days').days
          )}{' '}
          days
        </CardDescription>
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

        {children}
      </CardContent>
    </Card>
  );
}
