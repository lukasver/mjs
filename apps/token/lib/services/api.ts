'use client';

import { DEFAULT_STALE_TIME } from '@/common/config/constants';
import {
  getActiveSale,
  getContract,
  getCurrentUser,
  getExchangeRate,
  getPendingTransactions,
  getSale,
  getSales,
  getUserSaleTransactions,
  getUserTransactions,
  getWeb3Contract,
} from '@/lib/actions';
import { Currency, FOP, TransactionStatus } from '@prisma/client';
import { useSuspenseQuery } from '@tanstack/react-query';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getError = (data: any, error: any): string | null => {
  return (
    (error && error?.message) ||
    data?.serverError ||
    //TODO! improve this
    (data?.validationErrors && JSON.stringify(data?.validationErrors)) ||
    null
  );
};

export function useSales() {
  const { data, status, error, refetch } = useSuspenseQuery({
    queryKey: ['sales'],
    queryFn: () => getSales({}),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status, refetch };
}

export const useActiveSale = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['sales', 'active'],
    queryFn: () => getActiveSale(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data?.sales[0], error: e, status };
};

export const useSale = (id: string) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['sales', id],
    queryFn: ({ queryKey }) => getSale({ id: queryKey[1] as string }),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useUser = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['users', 'me'],
    queryFn: () => getCurrentUser(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export function useWeb3Contract(address: string) {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['contracts', address],
    queryFn: ({ queryKey }) => getWeb3Contract(queryKey[1] as string),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
}

// export const usePendingTransactions = () => {
//   const { data, status, error } = useSuspenseQuery({
//     queryKey: ['transactions', 'pending'],
//     queryFn: () => getPendingTransactions(),
//     staleTime: DEFAULT_STALE_TIME,
//   });
//   const e = getError(data, error);
//   return { data: data?.data, error: e, status };
// };

export const useSaftStatus = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['safts'],
    queryFn: () => getContract(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useTransactions = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['transactions'],
    queryFn: () => getUserTransactions({}),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const usePendingTransactions = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['transactions', 'status'],
    queryFn: () => getPendingTransactions(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

/**
 * Used to check if there is a pending transaction for current user for a particular sale
 * @param saleId - The ID of the sale to check transactions for
 * @param status - The transaction status to filter by
 */
export const useUserSaleTransactions = (
  saleId: string,
  status?: TransactionStatus
) => {
  const {
    data,
    status: queryStatus,
    error,
  } = useSuspenseQuery({
    queryKey: ['transactions', saleId, status],
    queryFn: ({ queryKey }) =>
      getUserSaleTransactions({
        saleId: queryKey[1] as string,
        status: queryKey[2] as TransactionStatus,
      }),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status: queryStatus };
};

/**
 * Get transactions for a specific user with optional filters
 * @param query - Query parameters for filtering transactions
 * @param query.userId - User ID to get transactions for
 * @param query.formOfPayment - Filter by form of payment
 * @param query.symbol - Filter by token symbol
 * @param query.sale - Filter by sale ID
 */
export const useUserTransactions = (
  params: {
    userId?: string;
    formOfPayment?: FOP;
    symbol?: string;
    sale?: string;
  } = {}
) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['transactions', 'user', params],
    queryFn: ({ queryKey }) =>
      getUserTransactions(queryKey[2] as typeof params),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useExchangeRate = ({
  from,
  to,
}: {
  from: Currency;
  to: Currency;
}) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['exchange', 'rate', from, to],
    queryFn: ({ queryKey }) =>
      getExchangeRate({
        from: queryKey[2] as Currency,
        to: queryKey[3] as Currency,
      }),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

/**
 * =====================================
 * =============== ADMIN ===============
 * =====================================
 */

// export const useAdminTransactions = () => {
//   const { data, status, error } = useSuspenseQuery({
//     queryKey: ['admin', 'transactions'],
//     queryFn: () => getAdminTransactions(),
//     staleTime: DEFAULT_STALE_TIME,
//   });
//   const e = getError(data, error);
//   return { data: data?.data, error: e, status };
// };
