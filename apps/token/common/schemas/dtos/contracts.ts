import { z } from "zod";
import { ContractStatusSchema } from "../generated";

export const CreateContractStatusDto = ContractStatusSchema.pick({
	contractId: true,
	userId: true,
});

export type CreateContractStatusDto = z.infer<typeof CreateContractStatusDto>;

export const UpdateContractStatusDto = ContractStatusSchema.omit({
	createdAt: true,
	updatedAt: true,
})
	.partial()
	.required({ status: true, id: true, userId: true });

export type UpdateContractStatusDto = z.infer<typeof UpdateContractStatusDto>;
