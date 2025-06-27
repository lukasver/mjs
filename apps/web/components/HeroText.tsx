'use client';

import { ComponentProps, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@mjs/ui/lib/utils';

function HeroText({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<typeof motion.div>) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <motion.div
      className={cn(
        'container mb-20 flex max-w-[64rem] flex-1 flex-col items-center justify-center gap-4 text-center',
        className
      )}
      style={{ y, opacity }}
      ref={heroRef}
      {...rest}
    >
      <motion.h1
        className='text-3xl font-heading sm:text-5xl md:text-6xl lg:text-7xl flex flex-col gap-2'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {children}
      </motion.h1>
    </motion.div>
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
  );
}

export default HeroText;
