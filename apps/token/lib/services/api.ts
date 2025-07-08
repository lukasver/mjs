'use client';

import { getContract, getCurrentUser, getSales } from '@/lib/actions';
import { FOP, TransactionStatus } from '@prisma/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

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
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['sales'],
    queryFn: () => getSales({}),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
}

export const useActiveSale = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['sales', 'active'],
    queryFn: () => getSales({ active: true }),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useSale = (id: string) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['sales', 'active'],
    queryFn: () => getSale(id),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useUser = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: () => getCurrentUser(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export function useWeb3Contract(address: string) {
  const { data, status, error } = useSuspenseQuery({
    queryKey: [`contract::${address}`],
    queryFn: () => getContract(address),
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

export const useContractStatus = (userId: string) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['contract'],
    queryFn: () => getContractStatus(userId),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useTransactionStatus = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['transactions', 'status'],
    queryFn: () => getTransactionStatus(),
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
export const useUserPendingTransactions = (
  saleId: string,
  status: TransactionStatus
) => {
  const {
    data,
    status: queryStatus,
    error,
  } = useSuspenseQuery({
    queryKey: ['transactions', 'pending', `transaction::${saleId}::${status}`],
    queryFn: () => getUserPendingTransactions({ saleId, status }),
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
export const useUserTransactions = ({
  userId = '',
  formOfPayment,
  symbol = '',
  sale = '',
}: {
  userId?: string;
  formOfPayment?: FOP;
  symbol?: string;
  sale?: string;
} = {}) => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: [
      'transactions',
      'user',
      `transaction::${userId}::${formOfPayment}::${symbol}::${sale}`,
    ],
    queryFn: () => getUserTransactions({ userId, formOfPayment, symbol, sale }),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};

export const useExchangeRate = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['exchange', 'rate'],
    queryFn: () => getExchangeRate(),
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
export const useAdminTransactions = () => {
  const { data, status, error } = useSuspenseQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => getAdminTransactions(),
    staleTime: DEFAULT_STALE_TIME,
  });
  const e = getError(data, error);
  return { data: data?.data, error: e, status };
};
