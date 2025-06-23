import { LocaleSwitch, Navbar as NavbarComponent } from 'nextra-theme-docs';
import { Logo } from './logo';
import { getTranslations } from '@/lib/i18n/get-dictionaries';
import { Locale } from '@/lib/i18n';

export const Navbar = async ({ lang }: { lang: Locale }) => {
  const t = await getTranslations(lang);
  return (
    <NavbarComponent
      className='bg-primary dark:bg-primary'
      logo={<Logo />}
      // chatIcon={<Icons.discord className='w-5 h-5' />}
      // projectIcon={<Icons.boxes className='w-5 h-5' />}
      // ... Your additional navbar options
    >
      <LocaleSwitch lite />
    </NavbarComponent>
  );
};
