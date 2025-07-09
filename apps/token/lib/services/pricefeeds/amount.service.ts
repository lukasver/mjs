import { Currency } from "@prisma/client";
import currencyJs from "currency.js";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ActiveSale } from "../../../common/types/sales";
import { callAPI } from "../fetch.service";

type AmountParameters = {
	initialCurrency: Currency;
	currency: Currency;
	base: number;
	quantity: number;
	addFee?: boolean;
	precision?: number;
};

type getAmountAndPricePerUnitReturn = {
	amount: string;
	pricePerUnit: string;
	exchangeRate: number;
	currency: Currency;
};

export class AmountCalculatorService {
	public FIAT_PRECISION: number = 4;
	public CRYPTO_PRECISION: number = 8;
	public BASIS_POINTS: number = currencyJs(2, { precision: 4 }).divide(
		10000,
	).value;

	getPrecision(currency: Currency, precision?: number) {
		if (precision) return precision;
		if (
			[Currency.EUR, Currency.USD, Currency.CHF, Currency.GBP].includes(
				currency as any,
			)
		) {
			return this.FIAT_PRECISION;
		}
		return this.CRYPTO_PRECISION;
	}

	getPricePerUnit({
		exchangeRate,
		precision,
		base,
	}: {
		exchangeRate: number;
		precision: number;
		base: number;
	}) {
		return currencyJs(exchangeRate, { precision }).multiply(base);
	}

	/**
	 * Function to get the amount to pay without calling the pricefeeds endpoint
	 * The price per unit needs to be known to avoid calling the endpoint.
	 */
	getTotalAmount({
		pricePerUnit,
		quantity,
		addFee,
		precision = this.FIAT_PRECISION,
	}: {
		pricePerUnit: currencyJs | string;
		quantity: string;
		addFee?: boolean;
		precision?: number;
	}) {
		let ppu: currencyJs;
		if (typeof pricePerUnit === "string") {
			ppu = currencyJs(pricePerUnit, { precision });
		} else {
			ppu = pricePerUnit;
		}
		let amount = ppu.multiply(quantity);
		if (addFee) {
			const fees = amount.multiply(this.BASIS_POINTS);
			amount = amount.add(fees);
		}
		return amount;
	}

	/**
	 * This is used to get the formatted amount in crypto as BigNumber to feed the useBlockchainTransaction with
	 * the current integer value. Essentially this function converts the floating point number into an integer
	 * @param amount amount to pay (to be formatted)
	 * @param decimals number of decimals of the crypto token. Ex: 6 USDC, 18 ETH (or other ERC20 tokens)
	 * @returns BigNumber
	 */
	getTotalAmountCrypto({
		amount,
		decimals,
	}: {
		amount: string;
		decimals: number;
	}): BigNumber {
		// Regular expression to match only the necessary number of decimal places
		const regex = new RegExp(`^(\\d+\\.?\\d{0,${decimals}})`);
		const match = amount.match(regex);

		// TODO! esto es necesario para evitar un underflow en el caso que los decimals del token
		// TODO! sean menores a los decimales recibido tras el cálculo del amount:
		// TODO! Ejemplo: "123.12345678" -> parseUnits("123.12345678, 6") -> daría error
		// TODO! por lo que se re-formatea el amount a la cantidad de decimales del token
		const formattedAmount = match
			? currencyJs(amount, { precision: decimals }).toString()
			: amount;

		return parseUnits(formattedAmount, decimals);
	}

	async getAmountAndPricePerUnit({
		initialCurrency,
		currency,
		base,
		quantity,
		addFee = false,
		precision,
	}: AmountParameters): Promise<getAmountAndPricePerUnitReturn> {
		const frontPrecision = this.getPrecision(currency, precision);

		const res = await this.getExchangeRate(initialCurrency, currency);
		if (!res?.value) {
			throw new Error("Error fetching exchange rate");
		}
		const exchangeRate = res.value;

		const pricePerUnit = this.getPricePerUnit({
			base,
			exchangeRate,
			precision: frontPrecision,
		});
		const amountToPay = this.getTotalAmount({
			pricePerUnit,
			quantity: quantity.toString(),
			addFee,
		});

		return {
			amount: amountToPay.toString(), // Total amount to pay in currency B
			pricePerUnit: pricePerUnit.toString(), // Price per single unit in currency B
			exchangeRate, // Exchange rate of currency B in terms of currency A
			currency, // New currency
		};
	}

	/**
	 * Main function to calculate the amount to pay by the user based on the bought token quantity.
	 * If PricePerUnit is not passed, then it will be fetched from the pricefeeds endpoint.
	 * Is an abstraction to use easily in frontend
	 * @param boughtTokenQuantity
	 * @param boughtTokenCurrency {Currency}
	 * @param tokenDecimals {number} amount of decimals of the token if is crypto payment
	 * @param activeSale
	 * @returns
	 */
	calculateAmountToPay = async (args: {
		quantity: string;
		currency: Currency;
		sale: ActiveSale;
		pricePerUnit?: string | null;
		tokenDecimals?: number;
	}) => {
		const { quantity, currency, sale, pricePerUnit, tokenDecimals } = args;
		let finalPPU: string | null | undefined = pricePerUnit;
		let amountToPay: string | undefined;

		// If we don't have a rate we need to fetch it
		if (!finalPPU) {
			const { pricePerUnit: newPPU, amount } =
				await this.getAmountAndPricePerUnit({
					initialCurrency: sale?.saleCurrency,
					currency: currency,
					base: sale?.tokenPricePerUnit,
					quantity: Number(quantity) || 0,
					addFee: sale?.saleCurrency !== currency,
					precision: tokenDecimals,
				});

			finalPPU = newPPU;
			amountToPay = amount;
			// Otherwise, we receive the rate from parameters
		} else {
			amountToPay = this.getTotalAmount({
				pricePerUnit: finalPPU,
				quantity: quantity || "0",
				addFee: sale?.saleCurrency !== currency,
				precision: tokenDecimals,
			})?.toString();
		}

		if (tokenDecimals) {
			const bigNumber = this.getTotalAmountCrypto({
				amount: amountToPay,
				decimals: tokenDecimals,
			});
			return {
				pricePerUnit: finalPPU,
				amount: amountToPay,
				currency,
				decimals: tokenDecimals,
				bigNumber: bigNumber,
			};
		} else {
			return {
				pricePerUnit: finalPPU,
				amount: amountToPay,
				currency,
			};
		}
	};

	async getExchangeRate(from: Currency, to: Currency) {
		return callAPI<{
			value: number;
			from: Currency;
			to: Currency;
			success: true;
		}>({
			url: `/feeds/rates`,
			method: "GET",
			params: { from, to },
		}).then((r) => r?.data);
	}
}

const amountCalculatorService = new AmountCalculatorService();

export default amountCalculatorService;
