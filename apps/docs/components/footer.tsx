'use client';
import { Footer as FooterComponent, LocaleSwitch } from 'nextra-theme-docs';
import { cn } from '@mjs/ui/lib/utils';
import { Suspense } from 'react';
import { Skeleton } from '@mjs/ui/primitives/skeleton';
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';
import { ActiveLink } from '@/components/active-link';
import { useTranslations } from '@/lib/i18n/provider';
import { metadata as siteConfig } from '@/lib/site-config';

import { SocialFooter } from '@mjs/ui/components/socials';

export const Footer = () => {
  return (
    <FooterComponent className='m-0! p-0! bg-black mx-auto w-full max-w-full!'>
      <AppFooter />
    </FooterComponent>
  );
};

const getFooterLinks = (t: (k: string) => string) => {
  return [
    { href: '/web', title: t('Footer.links.home') },
    { href: '/', title: t('Footer.links.docs') },
    { href: '/web/about', title: t('Footer.links.whoWeAre') },
    { href: '/web/terms', title: t('Footer.links.termsAndConditions') },
    { href: '/web/privacy', title: t('Footer.links.privacyPolicy') },
    { href: '/web/contact', title: t('Footer.links.contact') },
  ];
};

const AppFooter = ({ className }: { className?: string }) => {
  const { t } = useTranslations();
  return (
    <div className={cn('mt-auto w-full', className)}>
      <div
        className={cn(
          'flex flex-col gap-4 justify-between items-center w-full md:my-10 p-6'
        )}
      >
        <div className='w-full flex flex-col md:flex-row justify-between gap-6 mt-12  p-6 max-w-full container-wide'>
          <ActiveLinkProvider>
            <ul className='space-y-2'>
              {getFooterLinks(t).map((link) => (
                <li key={link.title}>
                  <ActiveLink
                    href={link.href}
                    className={'nav-link text-4xl text-white dark:text-white'}
                    activeClassName={'nav-link-active'}
                  >
                    <span>{link.title}</span>
                  </ActiveLink>
                </li>
              ))}
            </ul>
          </ActiveLinkProvider>
          <div>
            <Suspense fallback={<Skeleton className='w-[125px] h-8' />}>
              <LocaleSwitch />
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
    </div>
  );
};
