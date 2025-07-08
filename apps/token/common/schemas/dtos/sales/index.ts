import { z } from 'zod';
import { SaleSchema, SaleStatusSchema } from '@/schemas';

const BaseCtx = z.object({
  jwtContent: z.unknown(),
  address: z.string(),
});

export type BaseCtx = z.infer<typeof BaseCtx>;

export const ActionCtx = z
  .object({
    isAdmin: z.boolean().default(false).optional(),
    userId: z.string().optional(),
  })
  .merge(BaseCtx);

export type ActionCtx = z.infer<typeof ActionCtx>;

export const GetSalesDto = z
  .object({
    active: z.boolean().optional().default(false),
  })
  .optional();

export type GetSalesDto = z.infer<typeof GetSalesDto>;

export const GetSaleDto = z.object({
  id: z.string(),
});

export type GetSaleDto = z.infer<typeof GetSaleDto>;

export const CreateSaleDto = SaleSchema.pick({
  name: true,
  tokenName: true,
  tokenSymbol: true,
  tokenContractAddress: true,
  tokenPricePerUnit: true,
  toWalletsAddress: true,
  saleCurrency: true,
  saleStartDate: true,
  saleClosingDate: true,
  initialTokenQuantity: true,
  availableTokenQuantity: true,
  minimumTokenBuyPerUser: true,
  maximumTokenBuyPerUser: true,
  saftCheckbox: true,
  saftContract: true,
  tokenId: true,
});
export type CreateSaleDto = z.infer<typeof CreateSaleDto>;

export const UpdateSaleDto = z.object({
  id: z.string(),
  data: SaleSchema.partial(),
});
export type UpdateSaleDto = z.infer<typeof UpdateSaleDto>;

export const UpdateSaleStatusDto = z.object({
  id: z.string(),
  status: SaleStatusSchema,
});
export type UpdateSaleStatusDto = z.infer<typeof UpdateSaleStatusDto>;

export const DeleteSaleDto = z.object({
  id: z.string(),
});
export type DeleteSaleDto = z.infer<typeof DeleteSaleDto>;
