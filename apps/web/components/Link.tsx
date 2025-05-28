import { Link } from '@/lib/i18n/navigation';
import type { LinkProps } from 'next/link';
import { AnchorHTMLAttributes } from 'react';

export const CustomLink = ({
  href,
  ...rest
}: Omit<LinkProps, 'locale'> & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return <Link prefetch={false} href={href} {...rest} />;
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />;
  }

  return <a target='_blank' rel='noopener noreferrer' href={href} {...rest} />;
};

export default CustomLink;
