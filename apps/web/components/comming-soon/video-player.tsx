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
  mobileSrc:
    | { src: string; type: string }
    | { src: string; type: string }[]
    | null;
  className?: string;
  poster?: string;
}) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (isMobile) {
    if (!mobileSrc) {
      return null;
    }
    return (
      <>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={cn(
            'absolute w-full h-full object-contain bottom-[25%] md:bottom-auto md:inset-0',
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
        </video>
        <div
          className={cn(
            'absolute inset-0 z-50 h-[75%] sm:hidden',
            isMobile &&
              mobileSrc &&
              'bg-gradient-to-t from-[#79080A] from-5% via-[#79080A] via-5% to-transparent to-10%'
          )}
        />
      </>
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
        'absolute inset-0 w-full xl:object-contain hidden md:block 3xl:min-h-screen',
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
