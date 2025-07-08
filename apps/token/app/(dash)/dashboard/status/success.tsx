'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardTitle } from '@mjs/ui/primitives/card';
import { Button } from '@mjs/ui/primitives/button';
import { TurborepoLogo } from '@mjs/ui/components/turborepo-logo';
import { ExternalLink } from 'lucide-react';

/**
 * Success status page for dashboard actions.
 * Shows success message, project name, support email, and transaction link if available.
 */
const Success = () => {
  const router = useRouter();
  const query = useSearchParams();
  const t = useTranslations('status.success');
  const url = query.get('urlTxHash') as string | undefined;
  const projectName = query.get('projectName') as string | undefined;
  const email = query.get('email') as string | undefined;
  const handleClick = () => {
    router.push('/dashboard');
  };
  return (
    <div className='flex items-center justify-center min-h-[80vh] p-4'>
      <Card className='w-full max-w-xl flex flex-col items-center gap-6 bg-gradient-to-t from-[#e0ffe5] to-[#f7f9f9] border-none shadow-xl rounded-xl'>
        <div className='w-24 flex justify-center'>
          <TurborepoLogo />
        </div>
        <CardTitle className='text-center text-3xl font-semibold leading-tight max-w-[70%] sm:max-w-full'>
          {t('title')}
        </CardTitle>
        {projectName && (
          <div className='text-center text-base font-medium text-foreground max-w-[80%] sm:max-w-[50%] leading-7'>
            {email
              ? t('text', { projectName })
              : t('genericText', { projectName })}
            {email && (
              <div className='text-primary mt-2'>
                <a href={`mailto:${email}`} className='underline'>
                  {email}
                </a>
              </div>
            )}
          </div>
        )}
        {url && (
          <div className='flex items-center mt-2 mb-2'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 text-sm text-primary underline hover:text-primary/80 transition-colors'
            >
              {t('transactionLink', {
                defaultValue: 'If you want to see the transaction click here',
              })}
              <ExternalLink size={16} className='ml-1' />
            </a>
          </div>
        )}
        <Button
          variant='primary'
          onClick={handleClick}
          className='w-full max-w-xs'
        >
          {t('button')}
        </Button>
      </Card>
    </div>
  );
};

export default Success;
