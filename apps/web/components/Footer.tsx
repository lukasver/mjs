import { cn } from '@mjs/ui/lib/utils';
import {
  BoxesIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from 'lucide-react';

import { ThreadsIcon } from '@/components/icons/ThreadsIcon';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { TwitterXIcon } from '@/components/icons/XIcon';
import { getFooterLinks } from '@/data/config/footerLinks';
import { siteConfig } from '@/data/config/site.settings';
import { Button } from '@mjs/ui/primitives/button';
import { Skeleton } from '@mjs/ui/primitives/skeleton';
import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ActiveLink from './ActiveLink';
import LocaleSwitcher from './LocaleSwitcher';
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';

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
                      className={'nav-link text-4xl'}
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
          <div className='mb-3 flex flex-wrap justify-center gap-4'>
            {siteConfig.twitter && (
              <a href={siteConfig.twitter}>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='𝕏 (formerly Twitter)'
                >
                  <TwitterXIcon className='w-5 h-5' />
                </Button>
              </a>
            )}

            {siteConfig.instagram && (
              <a href={siteConfig.instagram}>
                <Button variant='ghost' size='icon' aria-label='Instagram'>
                  <InstagramIcon className='w-5 h-5' />
                </Button>
              </a>
            )}

            {siteConfig.tiktok && (
              <a href={siteConfig.tiktok}>
                <Button variant='ghost' size='icon' aria-label='TikTok'>
                  <TiktokIcon className='w-5 h-5' />
                </Button>
              </a>
            )}

            {siteConfig.github && (
              <a href={siteConfig.github}>
                <Button variant='ghost' size='icon' aria-label='GitHub'>
                  <GithubIcon className='w-6 h-6' />
                </Button>
              </a>
            )}

            {siteConfig.linkedin && (
              <a href={siteConfig.linkedin}>
                <Button variant='ghost' size='icon' aria-label='LinkedIn'>
                  <LinkedinIcon className='w-6 h-6' />
                </Button>
              </a>
            )}

            {siteConfig.youtube && (
              <a href={siteConfig.youtube}>
                <Button variant='ghost' size='icon' aria-label='YouTube'>
                  <YoutubeIcon className='w-7 h-7' />
                </Button>
              </a>
            )}

            {siteConfig.facebook && (
              <a href={siteConfig.facebook}>
                <Button variant='ghost' size='icon' aria-label='Facebook'>
                  <FacebookIcon className='w-6 h-6' />
                </Button>
              </a>
            )}

            {siteConfig.threads && (
              <a href={siteConfig.threads}>
                <Button variant='ghost' size='icon' aria-label='Threads'>
                  <ThreadsIcon className='w-6 h-6' />
                </Button>
              </a>
            )}

            {siteConfig.mastodon && (
              <a href={siteConfig.mastodon}>
                <Button variant='ghost' size='icon' aria-label='Mastodon'>
                  <BoxesIcon className='w-6 h-6' />
                </Button>
              </a>
            )}
          </div>
          <div className='w-full text-center lg:flex lg:justify-center p-4 mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400'>
            <span>
              {t('Footer.copyright', { year: new Date().getFullYear() })}
            </span>
            {/* <span>{` • `}</span>
						<span>{`© ${new Date().getFullYear()}`}</span> */}
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
