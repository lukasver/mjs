'use client';
import { Card } from '@mjs/ui/primitives/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@mjs/ui/primitives/accordion';
// Custom components (do not refactor):

import { EditImage, FieldDescription } from './components';
import { isSaleCreatedByCurrentUser } from './functions';
import { useActiveSale } from '@/lib/services/api';
import { invariant } from '@epic-web/invariant';
import { OverviewProject } from './overview';
import { ActiveSale } from '@/common/types/sales';
import { EditEmailContact } from './edit-email-contact';

const saleInformationValues: { [key: string]: string } = {
  summary: 'Summary',
  tokenUtility: 'Token Utility',
  tokenDistribution: 'Token Distribution',
  otherInformation: 'Other Information',
  tokenLifecycle: 'Token Lifecycle',
  liquidityPool: 'Liquidity Pool',
  futurePlans: 'Future Plans',
  imageSale: 'Image Sale',
  imageToken: 'Image Token',
  useOfProceeds: 'Use of Proceeds',
};

function isImageKey(
  key: string,
  saleInformationValues: Record<string, string>
) {
  return (
    saleInformationValues[key] === saleInformationValues['imageSale'] ||
    saleInformationValues[key] === saleInformationValues['imageToken']
  );
}

export const TokenSale = () => {
  const { data: sale } = useActiveSale();
  invariant(sale, 'Sale not found');
  const saleInformations = sale?.saleInformation;
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-start py-8 gap-4'>
        <h1 className='text-2xl font-bold text-primary'>{sale?.name}</h1>
        {/* TODO: Pass correct user object if available */}
        {isSaleCreatedByCurrentUser(sale, undefined) ? (
          <EditEmailContact sale={sale} mutate={mutate} />
        ) : null}
      </div>
      <Card className='w-full aspect-video relative overflow-hidden'>
        {/* ImageWithFallback and EditImage are custom, do not refactor */}
        <EditImage sale={sale} mutate={mutate} />
      </Card>
      {/* Responsive details: show ProjectDetailsTwo below on mobile, right on desktop */}
      <div className='block md:hidden mt-8'>
        <OverviewFormInvest sale={sale} />
      </div>
      {/* Sale information accordions */}
      {saleInformations && (
        <div className='mt-4'>
          <Accordion type='multiple' className='w-full'>
            {Object.keys(saleInformations).map((key) => {
              const title = saleInformationValues[key];
              const content =
                saleInformations[key as keyof typeof saleInformations];
              if (!title || !content || isImageKey(key, saleInformationValues))
                return null;
              return (
                <AccordionItem value={key} key={key}>
                  <AccordionTrigger>{title}</AccordionTrigger>
                  <AccordionContent>
                    <FieldDescription
                      title=''
                      content={content}
                      validation={key}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
      {/* Desktop ProjectDetailsTwo */}
      <div className='hidden md:flex flex-col items-end pt-8'>
        <OverviewFormInvest sale={sale} />
      </div>
    </div>
  );
};

const OverviewFormInvest = ({ sale }: { sale: ActiveSale }) => {
  return (
    <div className='flex flex-col gap-4'>
      <OverviewProject sale={sale} />
      {/* TODO ADD invest-form.tsx component */}
    </div>
  );
};
