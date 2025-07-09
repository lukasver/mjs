import { SaleInformationSchema } from "@/common/schemas/generated";
import { z } from "zod";

export const CreateSaleInformationDto = SaleInformationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
}).partial();
export type CreateSaleInformationDto = z.infer<typeof CreateSaleInformationDto>;

export const UpdateSaleInformationDto = SaleInformationSchema.partial();
export type UpdateSaleInformationDto = z.infer<typeof UpdateSaleInformationDto>;
