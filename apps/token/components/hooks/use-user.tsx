'use client';

import { getCurrentUser } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function useUser({
  enabled = true,
  staleTime = DEFAULT_STALE_TIME,
}: {
  enabled?: boolean;
  staleTime?: number;
} = {}) {
  const {
    data,
    error: _error,
    isLoading,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getCurrentUser(),
    staleTime,
    enabled,
  });

  const error = _error || data?.serverError || data?.validationErrors;

  return { data: data?.data, error, isLoading };
}
