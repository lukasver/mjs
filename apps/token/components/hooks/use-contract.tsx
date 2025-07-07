'use client';

import { getContract } from '@/lib/actions';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useContract(address: string) {
  const {
    data,
    error: _error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: [`contract::${address}`],
    queryFn: () => getContract(address),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const error = _error || data?.serverError || data?.validationErrors;

  return { data: data?.data, error, isLoading };
}
