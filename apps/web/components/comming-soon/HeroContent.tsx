import { cn } from '@mjs/ui/lib/utils';
import NewsletterForm from './newsletter';
import { EnterAnimation, FadeAnimation } from '@mjs/ui/components/motion';
import { HeroTextMobile } from './hero-text-mobile';
import SpeechBubbleContainer from './speech-bubble-container';
import { useLocale } from 'next-intl';

function HeroContent({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  agreeTerms?: React.ReactNode;
  lines?: string[];
}) {
  const locale = useLocale();
  const isEnglish = locale === 'en';

  return (
    <div
      className={cn('relative z-10 flex flex-col xl:min-h-screen', className)}
    >
      {/* Desktop Layout */}
      <div className='hidden lg:flex flex-1 items-center'>
        <div className='container mx-auto px-8'>
          <div className='grid grid-cols-2 gap-8 items-center'>
            {/* Left Side - Hero Text */}
            <div className='space-y-8 md:space-y-20'>
              <EnterAnimation duration={1}>
                <h1
                  className={cn(
                    'text-6xl/[90%] xl:text-8xl/[90%] font-semibold text-white',
                    isEnglish && 'text-6xl/[78%] xl:text-8xl/[78%]'
                  )}
                  dangerouslySetInnerHTML={{ __html: props.title }}
                />
              </EnterAnimation>

              {/* Subscription Form */}
              <div className='space-y-4 max-w-md font-head'>
                <FadeAnimation delay={1.5} duration={2}>
                  <p
                    className='text-white/90 text-lg lg:text-xl font-normal font-head'
                    dangerouslySetInnerHTML={{
                      __html: props.description || '',
                    }}
                  />
                </FadeAnimation>
                <FadeAnimation delay={3.5} duration={2}>
                  <>
                    <NewsletterForm className='lg:mb-6' />
                    <p className='text-white/90 text-sm  font-common font-semibold whitespace-nowrap'>
                      {props.agreeTerms}
                    </p>
                  </>
                </FadeAnimation>
              </div>
            </div>
          </div>
        </div>
        {/* Bubbles */}
        {children}
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden flex flex-col h-screen sm:h-auto relative'>
        <div className='flex-1 flex items-start lg:justify-center pt-8 lg:pt-12 px-6'>
          <SpeechBubbleContainer messages={props.lines || []}>
            <HeroTextMobile title={props.title} />
          </SpeechBubbleContainer>
        </div>

        <div className='flex-1 hidden lg:block' />

        <FadeAnimation delay={0.2}>
          <div className='lg:bg-gradient-to-t lg:from-red-900/90 lg:to-transparent p-6 space-y-4 max-w-sm'>
            {props.description && (
              <p
                className='text-white/90 text-left lg:text-center'
                dangerouslySetInnerHTML={{
                  __html: props.description,
                }}
              />
            )}

            <NewsletterForm className='space-y-3 w-full flex-col' />
            <p className='text-white/80 text-xs text-center lg:text-center font-common font-semibold'>
              {props.agreeTerms}
            </p>
          </div>
        </FadeAnimation>
      </div>

      {/* Bubbles */}
      {/* {children} */}
    </div>
  );
}

export default HeroContent;
