import prisma from "@/common/db/prisma";
import { Sale, SaleStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { HttpError } from "../errors";
import HttpStatusCode from "../httpStatusCodes";

export const changeActiveSaleToFinish = async (sale: Sale): Promise<Sale[]> => {
	await prisma.sale.update({
		where: {
			uuid: sale.uuid,
		},
		data: {
			status: SaleStatus.FINISHED,
		},
	});
	// respond with empty sale[] since current sale is no longer active.
	return [];
};

export const checkSaleDateIsNotExpired = (sale: Sale) => {
	if (DateTime.fromJSDate(sale.saleClosingDate) <= DateTime.now()) {
		throw new HttpError(
			HttpStatusCode.BAD_REQUEST,
			`Cannot OPEN an sale an expired sale with closing date: ${sale.saleClosingDate}`,
			sale,
		);
	}
};
