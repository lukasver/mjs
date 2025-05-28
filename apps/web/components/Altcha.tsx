'use client';

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

// Importing altcha package will introduce a new element <altcha-widget>
import 'altcha';
import 'altcha/i18n/all';
import { siteConfig } from '@/data/config/site.settings';

interface AltchaProps {
  onStateChange?: (ev: Event | CustomEvent) => void;
  language?: string;
}

const Altcha = forwardRef<{ value: string | null }, AltchaProps>(
  ({ onStateChange, language }, ref) => {
    const widgetRef = useRef<AltchaWidget & AltchaWidgetMethods & HTMLElement>(
      null
    );
    const [value, setValue] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          get value() {
            return value;
          },
        };
      },
      [value]
    );

    useEffect(() => {
      const handleStateChange = (ev: Event | CustomEvent) => {
        if ('detail' in ev) {
          setValue(ev.detail.payload || null);
          onStateChange?.(ev);
        }
      };

      const { current } = widgetRef;

      if (current) {
        current.addEventListener('statechange', handleStateChange);
        return () =>
          current.removeEventListener('statechange', handleStateChange);
      }
    }, [onStateChange]);

    /* Configure your `challengeurl` and remove the `test` attribute, see docs: https://altcha.org/docs/v2/widget-integration/  */
    return (
      <altcha-widget
        challengeurl={`${siteConfig.siteUrl}/api/captcha`}
        ref={widgetRef}
        style={{
          '--altcha-max-width': '100%',
        }}
        language={language || 'en'}
        // debug
        // test
      ></altcha-widget>
    );
  }
);

export default Altcha;
