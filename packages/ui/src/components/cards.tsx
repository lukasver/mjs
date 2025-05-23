import type { ReactNode } from 'react';
import {
  Card as CardPrimitive,
  CardContent,
  CardHeader,
  CardTitle,
} from '@mjs/ui/primitives/card';
import { cn } from '../lib/utils';
import { Icon } from './icons';

export function Card({
  title,
  children,
  href,
}: {
  title: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30'
      href={`${href}?utm_source=create-turbo&utm_medium=with-tailwind&utm_campaign=create-turbo"`}
      rel='noopener noreferrer'
      target='_blank'
    >
      <h2 className='mb-3 text-2xl font-semibold'>
        {title}{' '}
        <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
          -&gt;
        </span>
      </h2>
      <p className='m-0 max-w-[30ch] text-sm opacity-50'>{children}</p>
    </a>
  );
}

export const GlassyCard = ({
  children,
  title,
  icon,
  className,
}: {
  children: React.ReactNode;
  title: string;
  icon?: string;
  className?: string;
}) => {
  return (
    <CardPrimitive className={cn('glassy text-foreground', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-bold'>{title}</CardTitle>
        <Icon icon={icon} className='h-4 w-4' />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </CardPrimitive>
  );
};
