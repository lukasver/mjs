'use client';

import { getCurrentUser } from '@/lib/actions';
import { useSuspenseQuery } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function useUser({
  staleTime = DEFAULT_STALE_TIME,
}: {
  staleTime?: number;
} = {}) {
  const {
    data,
    error: _error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getCurrentUser(),
    staleTime,
  });

  const error = _error || data?.serverError || data?.validationErrors;

  return { data: data?.data, error, isLoading };
}
