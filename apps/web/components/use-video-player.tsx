'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

interface VideoPlayerContextValue {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | undefined>(
  undefined
);

/**
 * Hook to access video player state
 * @throws {Error} If used outside of VideoPlayerProvider
 */
export function useVideoPlayer(): VideoPlayerContextValue {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
}

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <VideoPlayerContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}
