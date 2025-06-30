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

  if (isMobile) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className={cn(
          'absolute inset-0 w-full h-full object-contain',
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
      </video>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{ height: 'inherit' }}
      className={cn(
        'absolute inset-0 w-full object-cover xl:object-contain hidden md:block 3xl:min-h-screen',
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
    </video>
  );
}

export default VideoPlayer;
