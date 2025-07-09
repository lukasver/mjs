import "server-only";
import { ActionCtx } from "@/common/schemas/dtos/sales";
import {
	CreateSaleInformationDto,
	UpdateSaleInformationDto,
} from "@/common/schemas/dtos/sales/information";
import { Failure, Success } from "@/common/schemas/dtos/utils";
import { prisma } from "@/db";

class SalesInformationController {
	/**
	 * Create or update sale information for a sale.
	 * @param dto - Data for creating/updating sale information.
	 */
	async upsertSaleInformation(
		dto: CreateSaleInformationDto & { saleId: string },
		_ctx: ActionCtx,
	) {
		try {
			if (!dto.saleId) {
				return Failure("Sale id missing", 400, "Sale id missing");
			}
			const sale = await prisma.sale.findUnique({
				where: { id: String(dto.saleId) },
			});
			if (!sale) {
				return Failure("Sale not found", 404, "Sale not found");
			}
			const saleInformation = await prisma.saleInformation.upsert({
				where: { saleId: sale.id },
				update: { ...dto },
				create: { ...dto },
			});
			return Success({ saleInformation });
		} catch (error) {
			return Failure(error);
		}
	}

	/**
	 * Update sale information fields (partial update).
	 * @param saleId - The sale id to update information for.
	 * @param dto - Partial update data.
	 */
	async updateSaleInformation(
		saleId: string,
		dto: UpdateSaleInformationDto,
		_ctx: ActionCtx,
	) {
		try {
			if (!saleId) {
				return Failure("Sale id missing", 400, "Sale id missing");
			}
			const saleInformation = await prisma.saleInformation.update({
				where: { saleId: String(saleId) },
				data: { ...dto },
			});
			return Success({ saleInformation });
		} catch (error) {
			return Failure(error);
		}
	}
}

export default new SalesInformationController();
