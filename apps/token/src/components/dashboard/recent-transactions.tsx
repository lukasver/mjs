import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { Badge } from '@mjs/ui/primitives/badge';

export function RecentTransactions() {
  const transactions = [
    {
      id: 'tx1',
      type: 'buy',
      amount: '5,000 NXT',
      value: '$2,500',
      wallet: '0x1a2...3b4c',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 'tx2',
      type: 'sell',
      amount: '1,200 NXT',
      value: '$600',
      wallet: '0x4d5...6e7f',
      time: '5 hours ago',
      status: 'completed',
    },
    {
      id: 'tx3',
      type: 'buy',
      amount: '10,000 NXT',
      value: '$5,000',
      wallet: '0x8g9...0h1i',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 'tx4',
      type: 'buy',
      amount: '3,500 NXT',
      value: '$1,750',
      wallet: '0x2j3...4k5l',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 'tx5',
      type: 'sell',
      amount: '800 NXT',
      value: '$400',
      wallet: '0x6m7...8n9o',
      time: '2 days ago',
      status: 'completed',
    },
  ];

  return (
    <Card className='border-zinc-800 bg-zinc-900/50'>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest token purchases and sales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='rounded-md border border-zinc-800'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-zinc-800 bg-zinc-950/50'>
                    <th className='px-4 py-3 text-left font-medium'>Type</th>
                    <th className='px-4 py-3 text-left font-medium'>Amount</th>
                    <th className='px-4 py-3 text-left font-medium'>Value</th>
                    <th className='px-4 py-3 text-left font-medium'>Wallet</th>
                    <th className='px-4 py-3 text-left font-medium'>Time</th>
                    <th className='px-4 py-3 text-left font-medium'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className='border-b border-zinc-800 last:border-0'
                    >
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2'>
                          {tx.type === 'buy' ? (
                            <ArrowDownLeft className='h-4 w-4 text-green-500' />
                          ) : (
                            <ArrowUpRight className='h-4 w-4 text-red-500' />
                          )}
                          <span
                            className={
                              tx.type === 'buy'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            {tx.type === 'buy' ? 'Buy' : 'Sell'}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3 font-medium'>{tx.amount}</td>
                      <td className='px-4 py-3'>{tx.value}</td>
                      <td className='px-4 py-3 font-mono text-xs'>
                        {tx.wallet}
                      </td>
                      <td className='px-4 py-3 text-zinc-400'>{tx.time}</td>
                      <td className='px-4 py-3'>
                        <Badge
                          variant='outline'
                          className='border-green-500 bg-green-500/10 text-green-500'
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
