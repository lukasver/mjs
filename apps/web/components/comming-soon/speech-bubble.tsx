'use client';
import { cn } from '@mjs/ui/lib/utils';
import { useSpeechBubbleMessage } from './speech-bubble-container';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Renders an animated speech bubble with a message using Motion for React.
 * The bubble fades in and moves up when appearing, and fades out and moves down when disappearing.
 */
const SpeechBubble = ({ className }: { className?: string }) => {
  const message = useSpeechBubbleMessage();
  const isVisible = Boolean(message);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key='speech-bubble'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn(
            // 'absolute z-30 -top-20 -right-20 xl:-right-10 xl:-top-10 2xl:-right-40 2xl:-top-40',
            'shadow-[3px_4px_20.4px_0px_rgba(74,0,0,1)] rounded-3xl',
            'z-30 w-full max-w-screen',
            className
          )}
        >
          <div className='px-8 py-4 relative bg-white/10 backdrop-blur-md border-2 border-white/90 rounded-3xl shadow-2xl max-w-xs lg:max-w-sm'>
            <p className='text-white text-xl xl:text-2xl font-medium'>
              {message}
            </p>
            <div className='text-white/30'>
              {/* Speech bubble tail */}
              <svg
                width='47'
                height='52'
                viewBox='0 0 57 52'
                xmlns='http://www.w3.org/2000/svg'
                stroke='white'
                strokeWidth='4'
                className='absolute -bottom-5 left-5 w-10 h-5 z-10 fill-white/30'
              >
                <path
                  d='M3.9994 0.5C22.9995 0.5 -8.00119 48 3.99941 50.5C16 53 21.9994 0.499296 46.4994 0.5'
                  stroke='white'
                />
              </svg>

              {/* <svg
                className='absolute -bottom-3 left-8 w-5 h-3 z-10'
                viewBox='0 0 20 12'
                fill='white'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M0 0L10 12L20 0Z'
                  fill='currentColor'
                  fillOpacity='0.7'
                  style={{ filter: 'blur(0.5px)' }}
                />
                <path
                  d='M0 0L10 12L20 0Z'
                  stroke='currentColor'
                  strokeOpacity='0.3'
                  strokeWidth='1'
                />
              </svg> */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
