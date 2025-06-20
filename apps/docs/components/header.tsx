import { LocaleSwitch, Navbar as NavbarComponent } from 'nextra-theme-docs';
import { Logo } from './logo';

export const Navbar = () => {
  return (
    <NavbarComponent
      className='bg-primary dark:bg-slate-800'
      logo={<Logo />}

      // chatIcon={<Icons.discord className='w-5 h-5' />}
      // projectIcon={<Icons.boxes className='w-5 h-5' />}
      // ... Your additional navbar options
    >
      <LocaleSwitch lite />
    </NavbarComponent>
  );
};
