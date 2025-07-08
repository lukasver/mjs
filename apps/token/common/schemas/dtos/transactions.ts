import { z } from 'zod';
import { SaleTransactionsSchema } from '@/common/schemas/generated';

export const CreateTransactionDto = SaleTransactionsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type CreateTransactionDto = z.infer<typeof CreateTransactionDto>;

export const UpdateTransactionDto = SaleTransactionsSchema.partial();
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionDto>;

export const GetTransactionDto = SaleTransactionsSchema.pick({
  userId: true,
  formOfPayment: true,
  tokenSymbol: true,
  saleId: true,
}).partial();
export type GetTransactionDto = z.infer<typeof GetTransactionDto>;

export const CancelAllTransactionsDto = z.object({
  saleId: z.string(),
  uuid: z.string(),
});
export type CancelAllTransactionsDto = z.infer<typeof CancelAllTransactionsDto>;
