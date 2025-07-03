'use client';
import { useSession } from 'next-auth/react';
import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import LoadingLayout from '@/components/LoadingContainer/LoadingLayout';
import { SmatIsoLogo } from '@/components/Logos/Logos';
import { Title } from '@/components/Typography/CommonTitles';
import ImageWithFallback from '@/components/imageWithFallback';
import { useME } from '@/services/api.service';
import { MINIO_PUBLIC_URL } from '@/services/minio.service';
import { getPlaceholderImage } from '@/utils/images';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Card, Typography, useMediaQuery } from '@mui/material';
import { Accordion, FormInvest } from '../../components';
import EditEmailContact from './EditEmailContact';
import { OverviewProject } from './OverviewProject';
import { EditImage, FieldDescription } from './components';
import { isSaleCreatedByCurrentUser, isSaleStatusOpen } from './functions';
import { SessionUser } from '../../../../common/types/next-auth';
import { ActiveSale, ActiveSaleRes } from '../../../../common/types/sales';
import { KeyedMutator } from 'swr';

const saleInformationValues: { [key: string]: string } = {
  summary: 'Summary',
  tokenUtility: 'Token Utility',
  tokenDistribution: 'Token Distribution',
  otherInformation: 'Other Information',
  tokenLifecycle: 'Token Lifecycle',
  liquidityPool: 'Liquidity Pool',
  futurePlans: 'Future Plans',
  imageSale: 'Image Sale',
  imageToken: 'Image Token',
  useOfProceeds: 'Use of Proceeds',
};

function isImageKey(key, saleInformationValues) {
  return (
    saleInformationValues[key] === saleInformationValues['imageSale'] ||
    saleInformationValues[key] === saleInformationValues['imageToken']
  );
}

const TokenSale = ({
  sale,
  mutate,
}: {
  sale: ActiveSale;
  mutate: KeyedMutator<ActiveSaleRes>;
}) => {
  const matches = useMediaQuery('(max-width:600px)');
  const { data: session, status } = useSession();
  const { data: userDbData, isLoading } = useME();

  const loading = status === 'loading' || isLoading;
  const userId = userDbData?.user?.sub;
  const user = session?.user;

  const saleInformations = sale?.saleInformation;

  return (
    <>
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: '2rem',
            gap: '1rem',
          }}
        >
          <Title color={'primary'} sx={{ fontWeight: 'bold' }}>
            {sale?.name}
          </Title>
          {isSaleCreatedByCurrentUser(sale, user) ? (
            <EditEmailContact sale={sale} mutate={mutate} />
          ) : null}
        </Box>

        <Card
          sx={{
            padding: '0rem',
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
          }}
        >
          <ImageWithFallback
            placeholder={'blur'}
            blurDataURL={getPlaceholderImage('100%', '100%')}
            fill
            src={
              sale?.saleInformation?.imageSale
                ? MINIO_PUBLIC_URL + sale?.saleInformation?.imageSale
                : ''
            }
            alt='cover'
          />
          <EditImage sale={sale} mutate={mutate} />
        </Card>

        {matches ? (
          <Box sx={{ mt: '2rem' }}>
            {user && userId ? (
              <ProjectDetailsTwo
                sale={sale}
                user={user}
                userId={userId}
                mutate={mutate}
              />
            ) : null}
          </Box>
        ) : null}

        {loading ? (
          <LoadingLayout />
        ) : (
          saleInformations && (
            <Box sx={{ marginTop: '1rem' }}>
              {Object.keys(saleInformations).map((key) => {
                const title = saleInformationValues[key];
                const content = saleInformations[key];

                return (
                  <Fragment key={key}>
                    {title &&
                    content &&
                    !isImageKey(key, saleInformationValues) ? (
                      <RenderAccordion
                        key={key}
                        title={title}
                        content={content}
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </Box>
          )
        )}
      </div>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          paddingTop: ' 2rem',
        }}
      >
        {!matches ? (
          user && userId ? (
            <ProjectDetailsTwo
              sale={sale}
              user={user}
              userId={userId}
              mutate={mutate}
            />
          ) : null
        ) : null}
      </Box>
    </>
  );
};

const RenderAccordion = ({ key, title, content }) => {
  return (
    <Accordion title={title} isTitle={true}>
      <FieldDescription title={''} content={content} validation={key} />
    </Accordion>
  );
};

const ProjectDetailsTwo = ({
  sale,
  user,
  userId,
  mutate,
}: {
  sale: ActiveSale;
  user: SessionUser;
  userId: string;
  mutate: KeyedMutator<ActiveSaleRes>;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '100%', sm: '90%' },
        minWidth: '300px',
        alignItems: 'flex-end',
        gap: '1rem',
      }}
    >
      <OverviewProject sale={sale} />
      {isSaleStatusOpen(sale?.status) ? (
        <FormInvest sale={sale} user={user} userId={userId} mutate={mutate} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <ErrorIcon
            sx={{
              width: '65px',
              height: '65px',
              stroke: '#ffc235',
              margin: '0 auto',
              backgroundColor: 'common.bgCard',
              color: 'common.bgCard',
              borderRadius: '100%',
              borderBottom: '1px solid #272d3b33',
              position: 'absolute',
              top: '0px',
              right: 0,
              left: 0,
            }}
            htmlColor={'#FFF'}
          />

          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              boxShadow: '0px 3px 6px #272d3b33',
              borderRadius: '10px',
              marginBottom: '1rem',
              marginTop: '3rem',
              padding: '2rem 2rem 1rem 2rem',
              textAlign: 'center',
            }}
          >
            <Typography variant={'h6'} component={'h6'} gutterBottom>
              {t('sale:tokenSaleEnded.title')}
            </Typography>
            <Typography
              variant={'body2'}
              component={'p'}
              sx={{ fontSize: '1rem' }}
            >
              {t('sale:tokenSaleEnded.subtitle')}
            </Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export const CommingSoon = () => {
  const { t } = useTranslation();
  const { push } = useRouter();
  return (
    <Box
      sx={{
        padding: '2rem',
        alignItems: 'center',
        gap: '1.2rem',
        height: '80vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '0.8rem',
      }}
    >
      <Box
        sx={{
          width: '100px',
        }}
      >
        <SmatIsoLogo sx={{ display: 'flex' }} />
      </Box>
      <Typography
        variant={'h4'}
        component={'h2'}
        sx={{
          fontWeight: '600',
          fontSize: '2.5rem',
          maxWidth: {
            xs: '70%',
            sm: '100%',
          },
          textAlign: 'center',
          lineHeight: '3.5rem',
        }}
      >
        <Trans t={t}>{'sale:commingSoon.soon'}</Trans>
      </Typography>

      <Button
        type={'submit'}
        color={'primary'}
        variant={'contained'}
        onClick={() => push('/dashboard')}
      >
        {t('sale:commingSoon.goDashboard')}
      </Button>
    </Box>
  );
};
export default TokenSale;
