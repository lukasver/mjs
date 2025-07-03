import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LoadingContainer, SEO } from '@/components';
import TokenSale, { CommingSoon } from '@/containers/Sales/Sales';
import MainLayout from '@/layouts/main.layout';
import ProjectDetailLayout from '@/layouts/sale.layout';
import { useActiveSale } from '@/services/api.service';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      // @ts-expect-error wontfix
      ...(await serverSideTranslations(locale, ['common', 'sale'])),
      locale,
      reloadOnPrerender: process.env.NODE_ENV !== 'production',
    },
  };
};

function BuyToken() {
  const { data, isLoading, mutate } = useActiveSale();
  const sale = data?.sales?.[0];
  return (
    <>
      <SEO title={sale?.name || 'Buy token'} />
      <MainLayout>
        <LoadingContainer loading={isLoading}>
          {sale ? (
            <ProjectDetailLayout>
              <TokenSale sale={sale} mutate={mutate} />
            </ProjectDetailLayout>
          ) : (
            <CommingSoon />
          )}
        </LoadingContainer>
      </MainLayout>
    </>
  );
}

export default BuyToken;
