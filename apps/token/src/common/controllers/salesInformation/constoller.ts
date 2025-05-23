import { AppNextApiRequest } from "@/_pages/api/_config";
import prisma from "@/common/db/prisma";
import { NextApiResponse } from "next";
import { HttpError } from "../errors";
import HttpStatusCode from "../httpStatusCodes";

class SalesInformationController {
	async createSaleInformation(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId } = req.query;
		const {
			summary,
			tokenUtility,
			tokenDistribution,
			otherInformation,
			tokenLifecycle,
			liquidityPool,
			futurePlans,
			useOfProceeds,
			imageSale,
			imageToken,
			contactEmail,
		} = req.body.formData;

		if (!userId) {
			throw new HttpError(HttpStatusCode.BAD_REQUEST, "Sale uuid missing");
		}

		try {
			const sale = await prisma.sale.findUnique({
				where: {
					uuid: String(userId),
				},
			});

			if (!sale) {
				throw new HttpError(HttpStatusCode.NOT_FOUND, "Sale not found");
			}

			const saleInformation = await prisma.saleInformation.upsert({
				where: { saleId: sale.uuid },
				update: {
					summary,
					tokenUtility,
					tokenDistribution,
					otherInformation,
					tokenLifecycle,
					liquidityPool,
					futurePlans,
					useOfProceeds,
					imageSale,
					imageToken,
					contactEmail,
				},
				create: {
					saleId: sale.uuid,
					summary,
					tokenUtility,
					tokenDistribution,
					otherInformation,
					tokenLifecycle,
					liquidityPool,
					futurePlans,
					useOfProceeds,
					imageSale,
					imageToken,
					contactEmail,
				},
			});

			res.status(HttpStatusCode.OK).json({ saleInformation });
		} catch (error) {
			console.error(error);
			res
				.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
				.json({ error: "Internal Server Error" });
		}
	}
	async updateSaleInformation(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId } = req.query;
		const { contactEmail } = req.body.formData;

		if (!userId) {
			throw new HttpError(HttpStatusCode.BAD_REQUEST, "Sale uuid missing");
		}
		try {
			const saleInformation = await prisma.saleInformation.update({
				where: { saleId: String(userId) },
				data: { contactEmail },
			});
			res.status(HttpStatusCode.OK).json({ saleInformation });
		} catch (error) {
			console.error(error);
			res
				.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
				.json({ error: "Internal Server Error" });
		}
	}
}
export default new SalesInformationController();
