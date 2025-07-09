import "server-only";
import { Currency } from "@prisma/client";

export class RatesController {
	async getExchangeRate(from: Currency, to: Currency) {
		//TODO! pending implementation
		// Check if rate exists in database
		// Fetch rate from service if not found in db
		// store rate in db
		// return rate
		return {
			value: 1.01,
			from,
			to,
			success: true,
		};
	}
}

export default new RatesController();
