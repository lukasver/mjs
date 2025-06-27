'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
// import { siteConfig } from "@/config/site"
// import { Icons } from "@/components/icons"
import { cn } from '@mjs/ui/lib/utils';

function VideoBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      id='hero'
      // ref={heroRef}
      className={cn('relative grid w-screen h-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {children}
      <div className='absolute inset-0 z-50'>
        <VideoComponent />
      </div>
    </motion.main>
  );
}

const VideoComponent = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => setVideoLoaded(true);

      video.addEventListener('loadeddata', handleLoadedData);
      if (video.readyState >= 2) setVideoLoaded(true);

      return () => video.removeEventListener('loadeddata', handleLoadedData);
    }
  }, []);

  console.debug('🚀 ~ VideoBackground.tsx:49 ~ videoLoaded:', videoLoaded);

  return (
    <div className='w-screen xl:flex xl:justify-center relative aspect-video'>
      {!videoLoaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='border-4 rounded-full size-90 animate-spin'></div>
        </div>
      )}
      <div className='relative'>
        <video
          ref={videoRef}
          muted
          loop
          autoPlay
          playsInline
          className={cn(
            'transition-opacity duration-1000',
            videoLoaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <source src={'/static/videos/comingsoon.webm'} type='video/webm' />
          <source src={'/static/videos/comingsoon.mp4'} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        {/* <div
          className='absolute inset-0'
          style={{
            background: `linear-gradient(90deg, 
        #770205 0%, 
        transparent 14%, 
        transparent 86%, 
        #770205 100%
      )`,
          }}
        /> */}
      </div>
    </div>
  );
};

export default VideoBackground;
