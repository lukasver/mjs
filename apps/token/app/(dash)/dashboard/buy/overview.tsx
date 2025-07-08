import { DateTime } from 'luxon';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@mjs/ui/primitives/card';
import { Separator } from '@mjs/ui/primitives/separator';
import { formatNumToIntlString, thousandSeparator } from '@/utils/FormatNumber';
import { percentCalculator } from '@/utils/percentCalculator';
import { ActiveSale } from '@/common/types/sales';
import { PercentBar } from '@/components/percent-bar';

interface SalesDetails {
  sale: ActiveSale;
}

export const OverviewProject = ({ sale }: SalesDetails) => {
  const {
    initialTokenQuantity,
    saleCurrency,
    tokenName,
    tokenSymbol,
    tokenPricePerUnit,
    saleClosingDate,
    saleStartDate,
  } = sale || {};
  const availableTokenQuantity = sale?.availableTokenQuantity || 0;
  return (
    <Card className='w-full shadow-lg rounded-xl p-6'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-primary'>Overview</CardTitle>
        <Separator className='my-2' />
      </CardHeader>
      <CardContent className='flex flex-col gap-4 p-0'>
        <Row
          title='Tokens available'
          value={thousandSeparator(String(availableTokenQuantity))}
        />
        <div className='mt-2'>
          <Row
            render={!!initialTokenQuantity}
            title={' '}
            value={`${formatNumToIntlString({
              value: sale && percentCalculator(sale),
            })} % Sold`}
          />
          <div className='w-full mt-1'>
            <PercentBar
              caption={'Total Tokens'}
              value={sale && percentCalculator(sale)}
              textValue={formatNumToIntlString({
                value: initialTokenQuantity,
              })}
            />
          </div>
        </div>
        <Separator className='my-4' />
        <Row title='Name' value={tokenName} render={!!tokenName} />
        <Row title='Symbol' value={tokenSymbol} render={!!tokenSymbol} />
        <Row
          title='Total supply'
          value={thousandSeparator(String(initialTokenQuantity))}
          render={!!initialTokenQuantity}
        />
        <Row
          title='Price'
          value={`${tokenPricePerUnit} ${saleCurrency}`}
          render={!!tokenPricePerUnit && !!saleCurrency}
        />
        <Row
          title='Open Date'
          value={
            saleStartDate
              ? DateTime.fromISO(String(saleStartDate)).toLocaleString(
                  DateTime.DATE_MED
                )
              : ''
          }
          render={!!saleStartDate}
        />
        <Row
          title='Close Date'
          value={
            saleClosingDate
              ? DateTime.fromISO(String(saleClosingDate)).toLocaleString(
                  DateTime.DATE_MED
                )
              : ''
          }
          render={!!saleClosingDate}
        />
      </CardContent>
    </Card>
  );
};

const Row = ({
  value = undefined,
  render = true,
  title,
}: {
  value?: string;
  title: string;
  render?: boolean;
}) =>
  render ? (
    <div className='flex justify-between items-center w-full'>
      <span className='text-base font-medium text-foreground'>{title}</span>
      {value && (
        <span className='text-sm text-muted-foreground font-semibold'>
          {value}
        </span>
      )}
    </div>
  ) : null;
