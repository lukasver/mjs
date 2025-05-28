import * as React from 'react';

import { cn } from '@mjs/ui/lib/utils';

// Replace the empty interface with a type alias
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-none bg-secondary-700/50 backdrop-blur-xs px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-[var(--input-shadow)]',
          className
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </textarea>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
