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
            'absolute z-30 -top-20 -right-20 xl:-right-10 xl:-top-10 2xl:-right-40 2xl:-top-40',
            className
          )}
        >
          <div className='px-8 py-4 relative bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-xs lg:max-w-sm'>
            <p className='text-white text-xl xl:text-2xl font-medium'>
              {message}
            </p>
            <div className='text-white/30'>
              {/* Speech bubble tail */}
              <svg
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
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
