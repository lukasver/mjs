'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@mjs/ui/primitives/button';
import { TurborepoLogo } from '@mjs/ui/components/turborepo-logo';

/**
 * ComingSoon page for the buy dashboard section.
 * Shows a coming soon message and a button to go to the dashboard.
 */
export const ComingSoon = () => {
  const t = useTranslations('sale.commingSoon');
  const router = useRouter();
  const handleClick = () => {
    router.push('/dashboard');
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] w-full p-8 rounded-xl gap-6 bg-gradient-to-t from-[#ffe5df] to-[#f7f9f9]'>
      <div className='w-24 flex justify-center'>
        <TurborepoLogo />
      </div>
      <h2 className='text-3xl font-semibold text-center leading-tight max-w-[70%] sm:max-w-full'>
        {t('soon')}
      </h2>
      <Button
        type='button'
        variant='primary'
        onClick={handleClick}
        className='w-full max-w-xs'
      >
        {t('goDashboard')}
      </Button>
    </div>
  );
};
