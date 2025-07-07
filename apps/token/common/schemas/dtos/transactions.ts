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
