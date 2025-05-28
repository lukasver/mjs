'use client';

import { Button } from '@mjs/ui/primitives/button';
import { Input } from '@mjs/ui/primitives/input';
import { Label } from '@mjs/ui/primitives/label';
import clsx from 'clsx';

/**
 * A newsletter input and button, used in LandingNewsletterSection, but can also be used as a standalone component in LandingPrimaryCta sections.
 */
export const LandingNewsletterInput = ({
  className,
  buttonLabel = 'Subscribe',
  placeholderLabel = 'Enter your email',
  inputLabel = 'Email address',
  variant = 'primary',
  onSubmit = () => {},
}: {
  className?: string;
  buttonLabel?: string;
  placeholderLabel?: string;
  inputLabel?: string;
  variant?: 'primary' | 'secondary';
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form
      className={clsx(
        'w-full flex flex-col sm:flex-row justify-center items-center gap-4',
        className
      )}
      onSubmit={onSubmit}
    >
      <div className='grow w-full md:w-auto'>
        <Label htmlFor='email' className='sr-only'>
          {inputLabel}
        </Label>
        <Input
          type='email'
          id='email'
          placeholder={placeholderLabel}
          required
          className='w-full'
        />
      </div>

      <Button type='submit' className='w-full sm:w-auto' variant={variant}>
        {buttonLabel}
      </Button>
    </form>
  );
};
