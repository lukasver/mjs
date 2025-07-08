import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LoadingContainer, SEO } from '@/components';
import TokenSale, { CommingSoon } from '@/containers/Sales/Sales';
import MainLayout from '@/layouts/main.layout';
import ProjectDetailLayout from '@/layouts/sale.layout';
import { useActiveSale } from '@/services/api.service';


export default async function BuyPage() {
  const { data, isLoading, mutate } = useActiveSale();
  
  const sale = data?.sales?.[0];
  return (
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

