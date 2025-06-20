import { LocaleSwitch, Navbar as NavbarComponent } from 'nextra-theme-docs';
import { Logo } from './logo';

export const Navbar = () => {
  return (
    <NavbarComponent
      logo={<Logo />}
      // ... Your additional navbar options
    >
      <LocaleSwitch lite />
    </NavbarComponent>
  );
};
