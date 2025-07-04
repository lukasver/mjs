'use client';

import { getSales } from '@/lib/actions';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { GetSalesDto } from '@/common/schemas/dtos/sales';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function useSales(
  _data: Partial<GetSalesDto>,
  {
    staleTime = DEFAULT_STALE_TIME,
  }: {
    staleTime?: number;
  } = {}
) {
  const {
    data,
    error: _error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: ['sales'],
    queryFn: () => getSales(_data),
    staleTime,
  });

  const error = _error || data?.serverError || data?.validationErrors;

  return { data: data?.data, error, isLoading };
}
