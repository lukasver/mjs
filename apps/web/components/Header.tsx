import ActiveLink from '@/components/ActiveLink';
import Image from '@/components/Image';
import { headerNavLinks } from '@/data/config/headerNavLinks';
import { siteConfig } from '@/data/config/site.settings';
import { ActiveLinkProvider } from '@mjs/ui/hooks/use-active-link';
import { cn } from '@mjs/ui/lib/utils';
import { Button } from '@mjs/ui/primitives/button';
import { getTranslations } from 'next-intl/server';
import Link from './Link';
import MobileNav from './MobileNav';

const Header = async ({ className }: { className?: string }) => {
  const t = await getTranslations();
  return (
    <header
      className={cn(
        'flex items-center justify-between py-10 flex-wrap w-full mb-20 lg:mb-32 pt-6 p-6 max-w-full container-wide gap-4 bg-transparent',
        className
      )}
    >
      <div className='shrink-0'>
        <Link href='/' aria-label={siteConfig.logoTitle}>
          <div className='flex items-center gap-3 justify-between'>
            <Image
              src='/static/images/logo-wt.webp'
              alt='Mahjong Stars logo'
              height={141}
              width={47}
              className='group-hover:animate-wiggle hover:animate-wiggle h-8 w-auto'
            />

            <div className='sr-only'>Mahjong Stars</div>
          </div>
        </Link>
      </div>
      <ActiveLinkProvider>
        <nav className='flex items-center leading-5 gap-4 sm:gap-6 flex-1'>
          <div className='items-center gap-4 flex-1 justify-evenly hidden lg:flex'>
            {headerNavLinks.map((link) => (
              <ActiveLink
                key={link.title}
                href={link.href}
                className={cn(
                  'nav-link hidden sm:block font-sans uppercase font-medium md:px-8 py-2 rounded'
                )}
                activeClassName='nav-link-active'
                scroll={link.href !== '/contact'}
              >
                <span>{t(`Navigation.links.${link.title.toLowerCase()}`)}</span>
              </ActiveLink>
            ))}
          </div>
          {/* <SearchButton />*/}
          {/* <ThemeSwitch /> */}
          <div className='flex justify-end gap-8 flex-1 lg:flex-none '>
            <Link href={'#newsletter'} className='hidden md:block'>
              <Button
                variant='accent'
                className='uppercase font-medium shadow'
                size='lg'
              >
                {/* {t("CTAs.logIn")} */}
                {t('Newsletter.button2')}
              </Button>
            </Link>
            <MobileNav />
          </div>
        </nav>
      </ActiveLinkProvider>
    </header>
  );
};

export default Header;
