'use client';

import React, { useState, useEffect, Children } from 'react';
import Link from './Link';
import { useActiveLink } from '@mjs/ui/hooks/use-active-link';

type ActiveLinkProps = {
  children: React.ReactElement;
  activeClassName: string;
  className?: string;
  href: string;
  as?: string;
  scroll?: boolean;
};

const ActiveLink = ({
  children,
  activeClassName,
  ...props
}: ActiveLinkProps) => {
  const { activeLink, setActiveLink } = useActiveLink();

  const child = Children.only(children);
  // @ts-expect-error - child.props.className is not typed
  const childClassName = child.props.className || '';
  const [className, setClassName] = useState(childClassName);

  useEffect(() => {
    const newClassName =
      activeLink === props.href
        ? `${childClassName} ${activeClassName}`.trim()
        : childClassName;

    if (newClassName !== className) {
      setClassName(newClassName);
    }
  }, [
    props.as,
    props.href,
    childClassName,
    activeClassName,
    setClassName,
    className,
    activeLink,
  ]);

  const handleLinkChange = (href: string) => () => {
    setActiveLink(href);
  };

  return (
    <Link {...props} href={props.href} onClick={handleLinkChange(props.href)}>
      {React.cloneElement(child, {
        // @ts-expect-error - child.props.className is not typed
        className: className || null,
      })}
    </Link>
  );
};

export default ActiveLink;
