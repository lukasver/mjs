// import { siteConfig } from "@/config/site"
// import { Icons } from "@/components/icons"
import VideoBackground from '@/components/VideoBackground';
import { getTranslations } from 'next-intl/server';

/// Try making video background container "contents" propoerty
export default async function VideoPage() {
  const t = await getTranslations();
  return (
    <VideoBackground>
      <div className='h-full w-full grid place-content-center'>
        <p>hola</p>
      </div>
      {/* <div className='z-40! h-[784px] grid grid-cols-4 gap-2 grid-rows-5 container mx-auto py-8 px-4'>
        <HeroText
          className='row-span-3 col-start-1 col-end-3 text-left'
          id={'hero'}
        >
          <span>Mahjong</span>
          <span>Stars is</span>
          <span>coming</span> <span>soon!</span>
        </HeroText> */}
      {/* <div
          id='newsletter'
          className='row-span-2 flex justify-center col-start-1 col-end-3'
        >
          <LandingNewsletterSection
            title={t('Newsletter.title')}
            description={t('Newsletter.description')}
            buttonLabel={t('Newsletter.button')}
            placeholderLabel={t('Newsletter.placeholder')}
          >
            <p className='text-sm'>{t('Newsletter.footer')}</p>
          </LandingNewsletterSection>
        </div> */}
      {/* </div> */}
    </VideoBackground>
  );
}

// <motion.div
// className='absolute inset-0 z-10 flex flex-col'
// style={{ y, opacity }}
// >
// <div className='container mb-20 flex max-w-[64rem] flex-1 flex-col items-center justify-center gap-4 text-center'>
//   <motion.h1
//     className='text-3xl font-heading sm:text-5xl md:text-6xl lg:text-7xl flex flex-col gap-2'
//     initial={{ y: -50, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     transition={{ duration: 0.8, delay: 0.2 }}
//   >
//     <span>Mahjong Stars</span>
//     <span>is coming soon!</span>
//   </motion.h1>
{
  /* <motion.p
    className='max-w-[42rem] leading-normal sm:text-xl sm:leading-8 '
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    Elaboramos cervezas artesanales con pasión y dedicación, utilizando
    ingredientes de la más alta calidad para crear sabores únicos que
    deleitan a los amantes de la buena cerveza.
  </motion.p> */
}
{
  /* 
  <motion.div
    className='flex items-center mt-6 gap-x-4'
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <Link
      href={metadata.discord}
      className='flex items-center gap-x-1 rounded-2xl px-4 py-1.5 text-sm font-medium transition-all hover:scale-110'
      target='_blank'
      rel='noopener'
    >
      <Icons.discord className='size-4' />
      <span className='sr-only'>Discord</span>
    </Link>
    <Link
      href={metadata.twitter}
      className='flex items-center gap-x-1 rounded-2xl px-4 py-1.5 text-sm font-medium transition-all hover:scale-110'
      target='_blank'
      rel='noopener'
    >
      <Icons.xTwitter className='size-4' />
      <span className='sr-only'>Twitter</span>
    </Link>
  </motion.div>

  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.8 }}
    className='absolute -translate-x-1/2 bottom-8 left-1/2'
  >
    <div className='flex flex-col items-center'>
      <div className='flex justify-center w-6 h-10 border-2 rounded-full'>
        <motion.div
          className='w-1.5 h-3 rounded-full mt-1'
          animate={{ y: [0, 12, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  </motion.div>
</div>
</motion.div> */
}
