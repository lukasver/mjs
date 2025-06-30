'use client';

import { cn } from '@mjs/ui/lib/utils';
import { useWindowSize } from 'usehooks-ts';

function VideoPlayer({
  src,
  mobileSrc,
  className,
  poster,
}: {
  src: { src: string; type: string } | { src: string; type: string }[];
  mobileSrc: { src: string; type: string } | { src: string; type: string }[];
  className?: string;
  poster?: string;
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  console.debug('🚀 ~ video-player.tsx:55 ~ isMobile:', isMobile);

  if (isMobile) {
    <video
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        'absolute inset-0 w-full h-full object-contain hidden md:block min-h-screen',
        className
      )}
      {...(poster ? { poster } : {})}
    >
      {Array.isArray(mobileSrc) ? (
        mobileSrc.map((props) => <source key={props.src} {...props} />)
      ) : (
        <source {...mobileSrc} />
      )}
      Your browser does not support the video tag.
      <div className='absolute inset-0 bg-gradient-to-br from-red-600 to-red-800' />
      {/* Left gradient overlay to hide video edges */}
      {/* <div className='absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-red-800 to-transparent z-5 hidden md:block' /> */}
      {/* Right gradient overlay to hide video edges */}
      {/* <div className='absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-red-800 to-transparent z-5 hidden md:block' /> */}
    </video>;
  }
  console.log('DESKTOP');

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        'absolute inset-0 w-full h-full object-contain hidden md:block min-h-screen',
        className
      )}
      {...(poster ? { poster } : {})}
    >
      {Array.isArray(src) ? (
        src.map((props) => <source key={props.src} {...props} />)
      ) : (
        <source {...src} />
      )}
      Your browser does not support the video tag.
      <div className='absolute inset-0 bg-gradient-to-br from-red-600 to-red-800' />
      {/* Left gradient overlay to hide video edges */}
      {/* <div className='absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-red-800 to-transparent z-5 hidden md:block' /> */}
      {/* Right gradient overlay to hide video edges */}
      {/* <div className='absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-red-800 to-transparent z-5 hidden md:block' /> */}
    </video>
  );
}

export default VideoPlayer;
