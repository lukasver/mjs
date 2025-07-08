import AdminSidebar from '@/app/(dash)/dashboard/admin-sidebar';
import { DashboardHeader } from '@/app/(dash)/dashboard/header';
import { PagesProviders } from '@/app/providers';
import { getFooterLinks, metadata } from '@/common/config/site';
import { BuyTokenButton } from '@/components/buy-token-button';
import { DashboardSidebar } from '@/components/sidebar';
import { getCurrentUser } from '@/lib/actions';
import { isAdmin } from '@/lib/utils';
import { Footer } from '@mjs/ui/components/footer';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const [user, t] = await Promise.all([getCurrentUser(), getTranslations()]);

  if (!user?.data || !isAdmin(user.data.roles)) {
    redirect('/?error=unauthorized');
  }
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
