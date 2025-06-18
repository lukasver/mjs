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
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';
import { Button } from '@mjs/ui/primitives/button';
import { Skeleton } from '@mjs/ui/primitives/skeleton';
import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import ActiveLink from './ActiveLink';
import LocaleSwitcher from './LocaleSwitcher';

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

            {siteConfig.discord && (
              <a href={siteConfig.discord}>
                <Button variant='ghost' size='icon' aria-label='Discord'>
                  <DiscordIcon className='w-6 h-6' />
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

const DiscordIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width='256'
      height='199'
      viewBox='0 0 256 199'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z'
        fill='currentColor'
        fillRule='nonzero'
      />
    </svg>
  );
};
