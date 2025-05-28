'use client';
import { useState, useEffect } from 'react';

type UseHash = [
  string,
  React.Dispatch<React.SetStateAction<`#${string}` | ''>>
];

export const useHash = (): UseHash => {
  const [hash, setHash] = useState<`#${string}` | ''>(
    window.location.hash as `#${string}`
  );
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash as `#${string}`);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return [hash, setHash];
};
