import exchangeRatesService from "@/services/pricefeeds/exchangeRate.service";
import { expect, test } from "@playwright/test";
import { Currency } from "@prisma/client";
import nock from "nock";
import { ACCEPTED_CURRENCIES, mockExchangeRates } from "../mocks/helpers";

test.describe("ExchangeRate service", () => {
	test.afterEach(() => {
		nock.cleanAll();
	});

	test.describe("Get exchange rates", () => {
		test("Service `getExchangeRate` method returns the success response from API from Currency[]", async () => {
			nock(exchangeRatesService.serviceUrl)
				.get("/data/pricemulti")
				.query({
					fsyms: ACCEPTED_CURRENCIES.join(","),
					tsyms: ACCEPTED_CURRENCIES.join(","),
				})
				.reply(200, mockExchangeRates);
			const response = await exchangeRatesService.getExchangeRate(
				ACCEPTED_CURRENCIES,
				ACCEPTED_CURRENCIES,
			);
			expect(response).toEqual(mockExchangeRates);
		});

		test("Service `getExchangeRate` method returns the success response from API from single Currency", async () => {
			const from = Currency.CHF;
			const to = Currency.EUR;
			const mockExchangeRates = { [Currency.CHF]: { [Currency.EUR]: 1.081 } };
			nock(exchangeRatesService.serviceUrl)
				.get("/data/pricemulti")
				.query({
					fsyms: from,
					tsyms: to,
				})
				.reply(200, mockExchangeRates);
			const response = await exchangeRatesService.getExchangeRate(from, to);
			expect(response).toEqual(mockExchangeRates);
		});

		test("Should return `null` if the API returns an error or payload is not correct", async () => {
			const from = Currency.CHF;
			const to = Currency.EUR;

			nock(exchangeRatesService.serviceUrl)
				.get("/data/pricemulti")
				.query({
					fsyms: from,
					tsyms: to,
				})
				.reply(500);

			const response = await exchangeRatesService.getExchangeRate(from, to);
			expect(response).toBeNull();
		});
	});
});
