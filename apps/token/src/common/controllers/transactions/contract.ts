import { AppNextApiRequest } from "@/_pages/api/_config";
import prisma from "@/common/db/prisma";
import { invariant } from "@epic-web/invariant";
import { SaleStatus } from "@prisma/client";
import { NextApiResponse } from "next";
import { HttpError } from "../errors";
import HttpStatusCode from "../httpStatusCodes";

class ContractController {
	async getContract(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId } = req.query;

		try {
			const sale = await prisma.sale.findFirst({
				where: { status: SaleStatus.OPEN },
			});
			invariant(sale, "Sale not found in DB");
			const { uuid: saleId } = sale;
			if (!saleId) {
				throw new HttpError(HttpStatusCode.BAD_REQUEST, "Sale not open");
			}

			const existingContract = await prisma.contractStatus.findFirst({
				where: { userId: userId as string, saleId: saleId as string },
			});

			if (existingContract) {
				res
					.status(HttpStatusCode.OK)
					.json({ contractStatus: existingContract });
			} else {
				res.status(HttpStatusCode.OK).json(null);
			}
		} catch (_error) {
			res
				.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
				.json({ error: "Internal Server Error" });
		}
	}

	async createContractStatus(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId, contractId } = req.body;
		if (!userId) {
			throw new HttpError(HttpStatusCode.BAD_REQUEST, "Missing userId");
		}
		try {
			const sale = await prisma.sale.findFirst({
				where: { status: SaleStatus.OPEN },
			});

			invariant(sale, "Sale not found in DB");
			const { uuid: saleId } = sale;
			if (!saleId) {
				throw new HttpError(HttpStatusCode.BAD_REQUEST, "Sale not open");
			}
			const newContract = await prisma.contractStatus.create({
				data: {
					userId: userId as string,
					saleId: saleId as string,
					contractId: contractId as string,
					status: "PENDING",
				},
			});
			res.status(HttpStatusCode.OK).json({ contractStatus: newContract });
		} catch (error) {
			console.error(error);
			res
				.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
				.json({ error: "Internal Server Error" });
		}
	}

	async deleteContractStatus(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId } = req.query;

		try {
			const existingContracts = await prisma.contractStatus.deleteMany({
				where: {
					userId: String(userId),
				},
			});

			if (existingContracts.count > 0) {
				res.status(HttpStatusCode.ACCEPTED).json("success");
			} else {
				res
					.status(HttpStatusCode.NOT_FOUND)
					.json({ message: "Contracts not found" });
			}
		} catch (error) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				message: "Internal Server Error",
				error: error.message,
			});
		}
	}
}

export default new ContractController();
