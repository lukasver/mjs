'use client';
import { cn } from '@mjs/ui/lib/utils';
import { useSpeechBubbleMessage } from './speech-bubble-container';
import { AnimatePresence, motion } from 'motion/react';
import { Dispatch, SetStateAction } from 'react';

/**
 * Renders an animated speech bubble with a message using Motion for React.
 * The bubble fades in and moves up when appearing, and fades out and moves down when disappearing.
 */
const SpeechBubble = ({
  className,
  show = true,
  onExitComplete,
}: {
  className?: string;
  show?: boolean;
  onExitComplete?: Dispatch<SetStateAction<boolean>>;
}) => {
  const message = useSpeechBubbleMessage();
  const isVisible = Boolean(message) && show;
  return (
    <AnimatePresence onExitComplete={() => onExitComplete?.(true)}>
      {isVisible && (
        <motion.div
          key='speech-bubble'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn(
            'shadow-[3px_4px_20.4px_0px_rgba(74,0,0,1)] rounded-2xl md:rounded-3xl',
            'z-30 w-full max-w-screen',
            className
          )}
        >
          <div className='px-8 py-4 relative bg-white/10 backdrop-blur-md border-2 border-white/90 rounded-2xl md:rounded-3xl shadow-2xl w-full'>
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
