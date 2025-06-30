import { getTranslations } from 'next-intl/server';
import HeroContent from './HeroContent';
import SpeechBubble from './speech-bubble';
import SpeechBubbleContainer from './speech-bubble-container';
import VideoPlayer from './video-player';
import Link from 'next/link';
import poster from '@/public/static/images/poster.webp';
import ErrorBoundary from '@mjs/ui/components/error-boundary';
import Image from 'next/image';

/**
 * Returns mNumber (1, 2, or 3) based on the current month.
 * July = 1, August = 2, September = 3, October = 1, etc.
 */
function getMNumber(date: Date = new Date()): 1 | 2 | 3 {
  // July is month 6 (0-indexed)
  const month = date.getMonth();
  // Calculate offset from July
  const offset = (month - 5 + 12) % 3;
  return (offset + 1) as 1 | 2 | 3;
}

export default async function CommingSoon() {
  const mNumber = getMNumber();
  const t = await getTranslations();
  const len = Array.from({ length: 20 });
  const lines = len
    .map((_, i) => t(`Bubbles.lines.${mNumber}.${i + 1}`))
    .filter((v, i) => v && v !== `Bubbles.lines.${mNumber}.${i + 1}`);
  const title = t.markup(`Bubbles.title.${mNumber}`, {
    // @ts-expect-error wontfix
    br: (chunks) => (
      <>
        <br />
        {chunks}
      </>
    ),
  });

  return (
    <div className='relative w-screen h-screen sm:h-[468px] lg:h-auto overflow-hidden xl:h-[calc(100dvh-10px)]'>
      <ErrorBoundary
        fallback={
          <Image
            {...poster}
            alt='poster'
            height={1080}
            width={1920}
            className='absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat max-w-screen'
          />
        }
      >
        <VideoPlayer
          src={[
            {
              src: `/static/videos/comingsoon-${mNumber}.webm`,
              type: 'video/webm',
            },
            {
              src: `/static/videos/comingsoon-${mNumber}.mp4`,
              type: 'video/mp4',
            },
          ]}
          mobileSrc={[
            {
              src: `/static/videos/comingsoon-mobile-${mNumber}.webm`,
              type: 'video/webm',
            },
            {
              src: `/static/videos/comingsoon-mobile-${mNumber}.mp4`,
              type: 'video/mp4',
            },
          ]}
          poster={poster.src}
        />
      </ErrorBoundary>

      {/* Static Image Background - Mobile */}
      {/* <div
        className='absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden'
        style={{
          backgroundImage: `url('${poster.src}?height=1080&width=1920')`,
        }}
      /> */}
      {/* Overlay */}
      <div className='absolute inset-0 bg-red-900/20' />

      <main id='newsletter'>
        <HeroContent
          title={t(title)}
          description={t('Bubbles.description')}
          agreeTerms={t.rich('Bubbles.agreeTerms', {
            terms: (chunks) => (
              <Link href='/terms' className='underline hover:text-white'>
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href='/privacy' className='underline hover:text-white'>
                {chunks}
              </Link>
            ),
          })}
          lines={lines}
        >
          <SpeechBubbleContainer messages={lines}>
            <SpeechBubble />
          </SpeechBubbleContainer>
        </HeroContent>
      </main>
    </div>
  );
}
