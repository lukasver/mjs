// import { siteConfig } from "@/config/site"
// import { Icons } from "@/components/icons"
import ComingSoon from '@/components/comming-soon/ComingSoon';

/// Try making video background container "contents" propoerty
export default async function VideoPage() {
  return (
    <ComingSoon />
    // <VideoBackground className='relative'>
    //   <div className='absolute inset-0 z-50'>
    //     <div className='aspect-video w-screen grid place-content-center grid-cols-2 grid-rows-2'>
    //       <div className='col-span-1 row-start-1 place-self-center'>
    //         <HeroText className='p-10'>Mahjong Stars is coming soon!</HeroText>
    //       </div>
    //       <div
    //         id={'bubbles'}
    //         className='col-span-1 row-start-1 place-self-center'
    //       >
    //         <div className='w-10 h-10 bg-red-500 rounded-full'>bubble</div>
    //       </div>
    //       <div
    //         id='newsletter'
    //         className='col-span-1 row-start-2 place-self-center'
    //       >
    //         <LandingNewsletterSection
    //           title={t('Newsletter.title')}
    //           description={
    //             'Subscribe and maybe, just maybe, we’ll let you in on it first.'
    //             // t('Newsletter.description')
    //           }
    //           buttonLabel={t('Newsletter.button')}
    //           placeholderLabel={t('Newsletter.placeholder')}
    //         >
    //           <p className='text-sm'>{t('Newsletter.footer')}</p>
    //         </LandingNewsletterSection>
    //       </div>
    //     </div>
    //   </div>
    // </VideoBackground>
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
