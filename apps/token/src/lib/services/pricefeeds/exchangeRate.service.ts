import { LogSeverity } from "@/common/enums";
import { Currency } from "@prisma/client";
import axios, { AxiosInstance } from "axios";
import logger from "../logger.server";
import { GetExchangeRate } from "./types";

class ExchangeRatesService {
	serviceUrl: string;
	backupServiceUrl: string;
	fetcher: AxiosInstance;
	bFetcher: AxiosInstance;

	constructor({ url, backup }: { url: string; backup?: string }) {
		const urlObject = new URL(url);

		this.serviceUrl = urlObject.href;
		this.fetcher = axios.create({
			baseURL: urlObject.href,
			headers: {
				Authorization: process.env.EXCHANGE_RATES_API_KEY,
			},
		});

		//TODO implement a backup if the main service fails
		if (backup) {
			const backupObject = new URL(backup);

			this.backupServiceUrl = backupObject.href;
			this.bFetcher = axios.create({
				baseURL: backupObject.href,
				headers: {
					Authorization: process.env.EXCHANGE_RATES_API_KEY_BACKUP,
				},
			});
		}
	}

	async getExchangeRate(
		from: Currency | Currency[],
		to: Currency | Currency[],
	): Promise<GetExchangeRate | null> {
		const parsedFrom = Array.isArray(from) ? from.join(",") : from;
		const parsedTo = Array.isArray(to) ? to.join(",") : to;

		try {
			const response = await this.fetcher({
				method: "GET",
				url: `/data/pricemulti?fsyms=${parsedFrom}&tsyms=${parsedTo}`,
			});
			return GetExchangeRate.parse(response.data);
		} catch (e) {
			// if fetcher or parsing fails, then response is unexpected. We need to try calling the backup service.
			logger(e, LogSeverity.ERROR);
			if (this.backupServiceUrl) {
				//TODO pending implementation
			}
			return null;
		}
	}
}

const exchangeRatesService = new ExchangeRatesService({
	// https://www.cryptocompare.com/cryptopian/api-keys
	url: "https://min-api.cryptocompare.com",
	// TODO!: check if we can use this or not https://openexchangerates.org/account
	backup: "https://openexchangerates.org/api",
});

export default exchangeRatesService;
