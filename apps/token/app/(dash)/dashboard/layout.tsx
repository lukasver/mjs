import { DashboardSidebar } from '../../../components/sidebar';
import { SidebarProvider } from '@mjs/ui/primitives/sidebar';
import { Suspense } from 'react';
import AdminSidebar from './admin-sidebar';
import { DashboardHeader } from './header';
import AccountProvider from '../../../components/thirdweb/account-provider';
import AutoConnect from '../../../components/thirdweb/autoconnect';
import { Footer } from '@mjs/ui/components/footer';
import { metadata } from '@/common/config/site';
import { getTranslations } from 'next-intl/server';
import { BuyTokenButton } from '@/components/buy-token-button';
import { getCurrentUser } from '@/lib/actions';
import { QueryClient } from '@tanstack/react-query';

/**
 * Layout component for the dashboard section
 * Provides Wagmi context and ensures wallet connectivity
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const t = await getTranslations();

  queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: () => getCurrentUser(),
  });

  return (
    <>
      <AutoConnect />
      <AccountProvider>
        <SidebarProvider>
          <DashboardSidebar>
            <Suspense fallback={null}>
              <AdminSidebar />
            </Suspense>
          </DashboardSidebar>
          <section className='flex-1 grid grid-rows-[auto_1fr_auto]'>
            <DashboardHeader>
              <Suspense fallback={null}>
                <BuyTokenButton />
              </Suspense>
            </DashboardHeader>
            {children}
            <Footer
              siteConfig={metadata}
              links={getFooterLinks(t)}
              copyright={t('Footer.copyright', {
                year: new Date().getFullYear(),
              })}
              className='bg-black'
            />
          </section>
        </SidebarProvider>
      </AccountProvider>
    </>
  );
}

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
