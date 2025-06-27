import { cn } from '@mjs/ui/lib/utils';

import { getFooterLinks } from '@/data/config/footerLinks';
import { siteConfig } from '@/data/config/site.settings';
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';
import { Skeleton } from '@mjs/ui/primitives/skeleton';
import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ActiveLink from './ActiveLink';
import LocaleSwitcher from './LocaleSwitcher';
import { SocialFooter } from '@mjs/ui/components/socials';

export default async function Footer({ className }: { className?: string }) {
  const t = await getTranslations();
  return (
    <footer className={cn('mt-auto w-full bg-black', className)}>
      <div
        className={cn(
          'flex flex-col gap-4 justify-between items-center w-full md:my-10 p-6'
        )}
      >
        <div className='w-full flex flex-col md:flex-row justify-between gap-6 mt-12  p-6 max-w-full container-wide'>
          <ActiveLinkProvider>
            <ul className='space-y-2'>
              {getFooterLinks(t).map(({ links }) =>
                links.map((link) => (
                  <li key={link.title}>
                    <ActiveLink
                      href={link.href}
                      className={'nav-link text-2xl md:text-4xl'}
                      activeClassName={'nav-link-active'}
                    >
                      <span>{link.title}</span>
                    </ActiveLink>
                  </li>
                ))
              )}
            </ul>
          </ActiveLinkProvider>
          <div>
            <Suspense fallback={<Skeleton className='w-[125px] h-8' />}>
              <LocaleSwitcherRSC />
            </Suspense>
          </div>
        </div>
      </div>

      <div>
        <hr
          className='w-full my-4 border-0 bg-linear-to-r from-white/5 via-black/10 to-white/5 dark:from-black/5 dark:via-white/30 darK:to-black/5'
          style={{ height: '1px' }}
        />

        <div className='py-8 px-2 flex flex-col items-center'>
          <SocialFooter config={siteConfig} />
          <div className='w-full text-center lg:flex lg:justify-center p-4 mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400'>
            <span>
              {t('Footer.copyright', { year: new Date().getFullYear() })}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const LocaleSwitcherRSC = async () => {
  const locale = await getLocale();
  return <LocaleSwitcher currentLocale={locale} />;
};
