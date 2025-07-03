import HttpStatusCode from '../../common/controllers/httpStatusCodes';
import { CreateEmailVerificationRes } from '../../common/types/emailVerification';
import {
  ActiveSaleRes,
  ContractStatusRes,
  CreateSaleInformationRes,
  CreateSaleRes,
  CreateTransactionRes,
  DeleteSaleRes,
  GetSaleRes,
  GetSalesRes,
  GetTransactionRes,
  GetTransactionsRes,
  UpdateAdminTransactionRes,
  UpdateContractStatusRes,
  UpdateSaleRes,
  UpdateTransactionRes,
  getAdminTransactions,
} from '../../common/types/sales';
import { API_USER, PersonalInfo } from '../../common/types/user';
import {
  ContractStatus,
  Currency,
  EmailVerification,
  FOP,
  Sale,
  SaleInformation,
  SaleTransactions,
  TransactionStatus, // User,
} from '@prisma/client';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { UrlContract } from './adobe.service';
import {
  APIErrorType,
  callAPI,
  isHTTPSuccessStatus,
  useAPI,
} from './fetch.service';

type CallApiRes<T> = Promise<T | APIErrorType>;

export const GET_UNHANDLED_ERROR = 'Oops something went wrong';

const notifyError = (
  err: AxiosError<{
    message?: string;
    error?: string;
    status?: HttpStatusCode;
  }>
): APIErrorType => {
  const { message, status } = err?.response?.data || {};
  toast.error(message || err.message || GET_UNHANDLED_ERROR);
  return {
    message: message ?? GET_UNHANDLED_ERROR,
    status: status ?? HttpStatusCode.INTERNAL_SERVER_ERROR,
    success: false,
  };
};

export const getSales = async () => {
  try {
    const { data } = await callAPI<GetSalesRes>({
      url: '/sales',
      method: 'GET' as const,
    });
    if (!data) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    return data.sales;
  } catch (err) {
    return notifyError(err);
  }
};

export const useAdminTransactions = (shouldFetch = true) => {
  return useAPI<getAdminTransactions>('/admin/transactions', shouldFetch);
};

export const useSales = (shouldFetch = true) => {
  return useAPI<GetSalesRes>('/sales', shouldFetch);
};

export const useSale = (saleId, shouldFetch = true) => {
  return useAPI<GetSaleRes>(`/sales/${saleId}`, shouldFetch && !!saleId);
};

export const useActiveSale = (shouldFetch = true) => {
  return useAPI<ActiveSaleRes>('/sales?active=true', shouldFetch);
};
export const useME = (shouldFetch = true) => {
  return useAPI<API_USER>('/user', shouldFetch);
};

export const usePendingTransactions = (shouldFetch = true) => {
  return useAPI<GetTransactionRes>('/cronjobs/transactions', shouldFetch);
};

export const useContractStatus = (userId, shouldFetch = true) => {
  return useAPI<UpdateContractStatusRes>(`/contract/${userId}`, shouldFetch);
};

export const useTransactionStatus = (shouldFetch = true) => {
  return useAPI<ContractStatusRes>(`/transactions`, shouldFetch);
};

/**
 * Used to check if there is a pending transaction for current user for a particular sale
 * @param userId
 * @param shouldFetch
 */
export const useUserPendingTransactions = (
  { saleId, status }: { saleId?: string; status: TransactionStatus },
  shouldFetch = true
) => {
  return useAPI<{
    totalCount: number;
    transactions: SaleTransactions[];
    contract: UrlContract;
  }>(
    `/transactions/sale/${saleId}?status=${status}`,
    shouldFetch && !!saleId && !!status
  );
};

export const savePersonalInfo = async (
  formData: PersonalInfo
): CallApiRes<{
  message: string;
  status?: number;
}> => {
  try {
    const { data } = await callAPI<{
      message: string;
      status?: number;
    }>({
      url: '/user',
      method: 'POST' as const,
      data: formData,
    });
    if (!data || data?.message?.includes('Request failed')) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    return data;
  } catch (err) {
    return notifyError(err);
  }
};
export const createSale = async (
  formData: Partial<Sale>
): CallApiRes<CreateSaleRes> => {
  try {
    const { data, status } = await callAPI<CreateSaleRes>({
      url: '/sales',
      method: 'POST' as const,
      data: formData,
    });
    if (!isHTTPSuccessStatus(status)) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    toast.success('Sale created successfully');
    return { success: true, sale: data.sale };
  } catch (err) {
    return notifyError(err);
  }
};

export const updateSale = async (
  saleId: string,
  formData: Partial<Sale>
): CallApiRes<CreateSaleRes> => {
  try {
    const { data, status } = await callAPI<CreateSaleRes>({
      url: `/sales/${saleId}`,
      method: 'PATCH' as const,
      data: formData,
    });
    if (!isHTTPSuccessStatus(status)) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    toast.success('Sale updated successfully');
    return { success: true, sale: data.sale };
  } catch (err) {
    return notifyError(err);
  }
};

export const createSaleInformation = async (
  saleId: string,
  formData: Partial<SaleInformation>
): CallApiRes<CreateSaleInformationRes> => {
  try {
    const { data } = await callAPI<CreateSaleInformationRes>({
      url: `/salesInformation/${saleId}`,
      method: 'POST' as const,
      data: {
        formData,
      },
    });

    return { success: true, saleInformation: data.saleInformation };
  } catch (error) {
    return notifyError(error);
  }
};

export const updateSaleInformation = async (
  saleId: string,
  formData: Partial<SaleInformation>
): CallApiRes<CreateSaleInformationRes> => {
  try {
    const { data } = await callAPI<CreateSaleInformationRes>({
      url: `/salesInformation/${saleId}`,
      method: 'PATCH' as const,
      data: {
        formData,
      },
    });

    return { success: true, saleInformation: data.saleInformation };
  } catch (error) {
    return notifyError(error);
  }
};

export const updateSaleStatus = async (
  saleId: string,
  status: Sale['status']
): CallApiRes<UpdateSaleRes> => {
  try {
    const { data } = await callAPI<UpdateSaleRes>({
      url: `/sales/${saleId}`,
      method: 'POST' as const,
      data: {
        status,
      },
    });
    toast.success('Sale status updated');
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const deleteSale = async (saleId: string): CallApiRes<DeleteSaleRes> => {
  try {
    const { data, status: statusRes } = await callAPI<DeleteSaleRes>({
      url: `/sales/${saleId}`,
      method: 'DELETE' as const,
    });
    if (!isHTTPSuccessStatus(statusRes)) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    toast.success('Sale deleted');
    return { uuid: data.uuid, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const getAllTransactions = async (): CallApiRes<GetTransactionsRes> => {
  try {
    const { data } = await callAPI<GetTransactionsRes>({
      url: '/transactions',
      method: 'GET' as const,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const userTransactions = async (
  userId,
  formOfPayment?,
  symbol?,
  sale?
): CallApiRes<GetTransactionsRes> => {
  try {
    const { data, status: statusRes } = await callAPI<GetTransactionsRes>({
      url: `/transactions/${userId}`,
      method: 'GET' as const,
      params: {
        formOfPayment,
        symbol,
        sale,
      },
    });
    if (!statusRes) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const useUserTransactions = (
  query: {
    userId?: string;
    formOfPayment?: FOP;
    symbol?: string;
    sale?: string;
  } = {
    userId: '',
    formOfPayment: undefined,
    symbol: '',
    sale: '',
  },
  shouldFetch = true
) => {
  const { userId, formOfPayment, symbol, sale } = query;
  // const qParams = new URLSearchParams({ ...params });

  return useAPI<GetTransactionsRes>(
    `/transactions/${userId}`,
    shouldFetch && !!userId,
    {
      params: { formOfPayment, symbol, sale },
    }
  );
};

export const createTransaction = async (
  formData: Omit<
    SaleTransactions,
    | 'status'
    | 'uuid'
    | 'createdAt'
    | 'updatedAt'
    | 'agreementId'
    | 'txHash'
    | 'comment'
    | 'confirmationId'
    | 'blockchainId'
  >
): CallApiRes<CreateTransactionRes> => {
  try {
    const { data } = await callAPI<CreateTransactionRes>({
      url: '/transactions',
      method: 'POST' as const,
      data: formData,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const confirmTransaction = async (formData: {
  uuid: string;
  saleId?: Sale['uuid'];
  statusTx: TransactionStatus;
  comment?: SaleTransactions['comment'];
  confirmationId?: SaleTransactions['confirmationId'];
  txHash?: SaleTransactions['txHash'];
  chainId?: SaleTransactions['blockchainId'];
}): CallApiRes<UpdateTransactionRes> => {
  try {
    const { data } = await callAPI<UpdateTransactionRes>({
      url: '/transactions',
      method: 'PATCH' as const,
      data: formData,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const confirmAdminTransaction = async (
  formData: Partial<SaleTransactions>
): CallApiRes<UpdateAdminTransactionRes> => {
  try {
    const { data } = await callAPI<UpdateAdminTransactionRes>({
      url: '/admin/transactions',
      method: 'PATCH' as const,
      data: formData,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const cancelAllTransactions = async (formData: {
  saleId: Sale['uuid'];
  uuid: string;
  statusTx: TransactionStatus;
}): CallApiRes<UpdateTransactionRes> => {
  try {
    const { data } = await callAPI<UpdateTransactionRes>({
      url: '/transactions',
      method: 'PATCH' as const,
      data: formData,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data, success: true };
  } catch (err) {
    return notifyError(err);
  }
};

export const createEmailVerification = async (
  formData: Partial<EmailVerification>
): CallApiRes<CreateEmailVerificationRes> => {
  try {
    const { data, status } = await callAPI<CreateEmailVerificationRes>({
      url: '/emailVerification',
      method: 'POST' as const,
      data: formData,
    });
    if (!isHTTPSuccessStatus(status)) {
      throw new Error(GET_UNHANDLED_ERROR);
    }
    return { success: true, emailVerification: data.emailVerification };
  } catch (err) {
    return notifyError(err);
  }
};

export const updateContractStatus = async (
  formData: Partial<ContractStatus>
): CallApiRes<UpdateContractStatusRes> => {
  try {
    const { data } = await callAPI<UpdateContractStatusRes>({
      url: '/contract',
      method: 'POST' as const,
      data: formData,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data };
  } catch (err) {
    return notifyError(err);
  }
};

export const deleteContractStatus = async (
  userId
): CallApiRes<UpdateContractStatusRes> => {
  try {
    const { data } = await callAPI<UpdateContractStatusRes>({
      url: `/contract/${userId}`,
      method: 'DELETE' as const,
    });
    if (!data) throw new Error(GET_UNHANDLED_ERROR);
    return { ...data };
  } catch (err) {
    return notifyError(err);
  }
};

export const confirmContractSignature = async () => {
  try {
    return (
      await callAPI<{ success: true }>({
        url: `/adobe`,
        method: 'POST',
      })
    )?.data;
  } catch (err) {
    return notifyError(err);
  }
};

export const getExchangeRate = async (from: Currency, to: Currency) => {
  try {
    return (
      await callAPI<{
        value: number;
        from: Currency;
        to: Currency;
        success: true;
      }>({
        url: `/feeds/rates`,
        method: 'GET',
        params: { from, to },
      })
    )?.data;
  } catch (err) {
    return notifyError(err);
  }
};
