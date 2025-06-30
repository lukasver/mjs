import { cn } from '@mjs/ui/lib/utils';
import NewsletterForm from './newsletter';
import { EnterAnimation, FadeAnimation } from '@mjs/ui/components/motion';

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
  return (
    <div
      className={cn('relative z-10 flex flex-col 2xl:min-h-screen', className)}
    >
      {/* Desktop Layout */}
      <div className='hidden lg:flex flex-1 items-center'>
        <div className='container mx-auto px-8'>
          <div className='grid grid-cols-2 gap-8 items-center'>
            {/* Left Side - Hero Text */}
            <div className='space-y-8 md:space-y-20'>
              <EnterAnimation duration={1}>
                <h1
                  className='text-6xl xl:text-8xl font-bold text-white '
                  dangerouslySetInnerHTML={{ __html: props.title }}
                />
              </EnterAnimation>

              {/* Subscription Form */}
              <div className='space-y-4 max-w-md font-head'>
                <FadeAnimation delay={1.5} duration={2}>
                  <p className='text-white/90 text-lg lg:text-xl'>
                    {props.description}
                  </p>
                </FadeAnimation>
                <FadeAnimation delay={3.5} duration={2}>
                  <>
                    <NewsletterForm />
                    <p className='text-white/90 text-sm font-common font-medium'>
                      {props.agreeTerms}
                    </p>
                  </>
                </FadeAnimation>
              </div>
            </div>

            {/* Right Side - Character Space (video shows through) */}
            {/* <div className='h-full relative'>{children}</div> */}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden flex flex-col h-screen sm:h-auto'>
        <div className='flex-1 flex items-start lg:justify-center pt-8 lg:pt-12 px-6'>
          <EnterAnimation>
            <h1
              className='text-4xl sm:text-5xl font-bold text-white text-left lg:text-center leading-tight'
              dangerouslySetInnerHTML={{ __html: props.title }}
            />
          </EnterAnimation>
        </div>

        <div className='flex-1 hidden lg:block' />

        <FadeAnimation delay={0.2}>
          <div className='lg:bg-gradient-to-t lg:from-red-900/90 lg:to-transparent p-6 space-y-4 max-w-sm'>
            <p className='text-white/90 text-left lg:text-center'>
              {props.description}
            </p>
            <NewsletterForm className='space-y-3 w-full flex-col' />
            <p className='text-white/70 text-xs text-left lg:text-center'>
              {props.agreeTerms}
            </p>
          </div>
        </FadeAnimation>
      </div>

      {/* Bubbles */}
      {children}
    </div>
  );
}

export default HeroContent;
