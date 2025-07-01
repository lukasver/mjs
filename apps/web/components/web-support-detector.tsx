'use client';

import { useEffect, useState } from 'react';

interface WebMSupportDetectorProps {
  children: React.ReactNode;
  webmBackgroundColor: string;
  fallbackBackgroundColor: string;
}

/**
 * Detects WebM support and Safari browser, applying different background colors accordingly.
 * Safari and other browsers without WebM support will get the fallback color.
 */
export function WebMSupportDetector({
  children,
  webmBackgroundColor,
  fallbackBackgroundColor,
}: WebMSupportDetectorProps) {
  const [shouldUseFallback, setShouldUseFallback] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkBrowserSupport = () => {
      // Check if it's Safari
      const isSafari = () => {
        const userAgent = navigator?.userAgent?.toLowerCase();

        return (
          userAgent?.includes('safari') &&
          !userAgent?.includes('chrome') &&
          !userAgent?.includes('chromium') &&
          !userAgent?.includes('edg') &&
          !userAgent?.includes('firefox')
        );
      };

      // Check WebM support
      const checkWebMSupport = () => {
        const video = document.createElement('video');
        const canPlayWebM = video.canPlayType('video/webm');
        return canPlayWebM === 'probably' || canPlayWebM === 'maybe';
      };

      const isSafariBrowser = isSafari();
      const supportsWebM = checkWebMSupport();

      // Use fallback if Safari OR if WebM is not supported
      const useFallback = isSafariBrowser || !supportsWebM;
      setShouldUseFallback(useFallback);
    };

    checkBrowserSupport();
  }, []);

  // Show loading state or default to WebM support while checking
  if (shouldUseFallback === null) {
    return <div className={webmBackgroundColor}>{children}</div>;
  }

  const backgroundColor = shouldUseFallback
    ? fallbackBackgroundColor
    : webmBackgroundColor;

  return <div className={backgroundColor}>{children}</div>;
}
