import { DashboardSidebar } from '../../../components/sidebar';
import { Suspense } from 'react';
import AdminSidebar from './admin-sidebar';
import { DashboardHeader } from './header';
import { Footer } from '@mjs/ui/components/footer';
import { getFooterLinks, metadata } from '@/common/config/site';
import { getTranslations } from 'next-intl/server';
import { BuyTokenButton } from '@/components/buy-token-button';
import { getCurrentUser } from '@/lib/actions';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { PagesProviders } from '@/app/providers';

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
    queryKey: ['user', 'me'],
    queryFn: () => getCurrentUser(),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PagesProviders>
          <>
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
          </>
        </PagesProviders>
      </HydrationBoundary>
    </>
  );
}
