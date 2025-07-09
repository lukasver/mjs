import { prisma } from "@/db";
import { Sale, SaleStatus } from "@prisma/client";
import { DateTime } from "luxon";

export const changeActiveSaleToFinish = async (sale: Sale): Promise<Sale[]> => {
	await prisma.sale.update({
		where: {
			id: sale.id,
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
		throw new Error(
			`Cannot OPEN an sale an expired sale with closing date: ${sale.saleClosingDate}`,
		);
	}
};
