import { AmountCalculatorService } from "@/services/pricefeeds/amount.service";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import currencyJs from "currency.js";
import { BigNumber } from "ethers";
import nock from "nock";
import sinon from "sinon";
import {
	CRYPTO_CURRENCIES,
	FIAT_CURRENCIES,
	mockExchangeRates,
} from "../mocks/helpers";

test.describe("Amount Calculator service", () => {
	const domain = process.env.NEXT_PUBLIC_DOMAIN!;
	nock.disableNetConnect();
	nock.enableNetConnect(domain);

	const service = new AmountCalculatorService();
	const sandbox = sinon.createSandbox();

	test.afterEach(function () {
		sandbox.restore();
	});

	test.describe("[getPrecision]", () => {
		test("Return precision for FIAT currencies", () => {
			const spy = sandbox.spy(service, "getPrecision");
			let callCount = 0;
			for (const currency of FIAT_CURRENCIES) {
				callCount++;
				const value = service.getPrecision(currency);
				expect(value).toBeTruthy();
				expect(value, `Error with: ${currency}`).toBe(service.FIAT_PRECISION);
				expect(spy.calledWith(currency)).toBe(true);
				expect(spy.callCount).toBe(callCount);
			}
		});

		test("Return precision for CRYPTO currencies", () => {
			let callCount = 0;
			const spy = sandbox.spy(service, "getPrecision");
			for (const currency of CRYPTO_CURRENCIES) {
				callCount++;
				const value = service.getPrecision(currency);
				expect(value).toBeTruthy();
				expect(value, `Error with: ${currency}`).toBe(service.CRYPTO_PRECISION);
				expect(spy.calledWith(currency)).toBe(true);
				expect(spy.callCount).toBe(callCount);
			}
		});
	});

	test.describe("[getPricePerUnit] ", () => {
		test("Should calculate price per unit with correct precision", () => {
			const spy = sandbox.spy(service, "getPricePerUnit");

			const exchangeRate = 0.2;
			const base = 0.1;
			const precision = 4;
			const result = service.getPricePerUnit({
				exchangeRate,
				precision,
				base,
			});
			expect(spy.calledWithExactly({ exchangeRate, precision, base })).toBe(
				true,
			);
			expect(result).toBeTruthy();
			expect(result).toBeInstanceOf(currencyJs);
			expect(result.intValue).not.toBe(0.2 * 0.1);
			expect(result.value).not.toBe(0.2 * 0.1);
			expect(result.toString()).toBe("0.0200");
		});

		test("Should calculate price per unit with correct precision for several known and random cases", () => {
			const spy = sandbox.spy(service, "getPricePerUnit");
			const iterable = Object.values(mockExchangeRates)
				.reduce((agg, el) => {
					return agg.concat(Object.values(el)).filter((e) => e !== 1);
				}, [] as number[])
				.concat(1);
			let calledCount = 0;
			for (const exchangeRate of iterable) {
				calledCount++;
				const mockBase = faker.number.float({
					min: 0.01,
					max: 100,
					fractionDigits: 2,
				});
				const mockPrecision = faker.helpers.arrayElement([
					service.FIAT_PRECISION,
					service.CRYPTO_PRECISION,
				]);
				const result = service.getPricePerUnit({
					exchangeRate,
					precision: mockPrecision,
					base: mockBase,
				});
				expect(
					spy.calledWithExactly({
						exchangeRate,
						precision: mockPrecision,
						base: mockBase,
					}),
				).toBe(true);
				expect(spy.callCount).toBe(calledCount);
				const strResult = result.toString();
				expect(result).toBeTruthy();
				expect(result).toBeInstanceOf(currencyJs);
				expect(strResult.split(".")[1]?.length).toBe(
					mockPrecision === service.FIAT_PRECISION
						? service.FIAT_PRECISION
						: service.CRYPTO_PRECISION,
				);
			}
			const cases = Array.from(Array(100), () => ({
				exchangeRate: faker.number.float({
					min: 0.00000001,
					max: 999.99,
					fractionDigits: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8]),
				}),
				precision: faker.helpers.arrayElement([
					service.FIAT_PRECISION,
					service.CRYPTO_PRECISION,
				]),
				base: faker.number.float({ min: 0.01, max: 100, fractionDigits: 2 }),
			}));
			for (const payload of cases) {
				const result = service.getPricePerUnit(payload);
				expect(result).toBeTruthy();
				expect(result).toBeInstanceOf(currencyJs);
				expect(result.toString().split(".")[1]?.length).toBe(
					payload.precision === service.FIAT_PRECISION
						? service.FIAT_PRECISION
						: service.CRYPTO_PRECISION,
				);
			}
		});
	});

	test.describe("[getTotalAmount]", () => {
		test("Should calculate total amount to pay with correct precision", () => {
			const spy = sandbox.spy(service, "getTotalAmount");

			const cases = Array.from(Array(100), () => {
				const precision = faker.helpers.arrayElement([
					service.FIAT_PRECISION,
					service.CRYPTO_PRECISION,
				]);
				const ppu = service.getPricePerUnit({
					exchangeRate: faker.number.float({
						min: 0.00000001,
						max: 999.99,
						fractionDigits: faker.helpers.arrayElement([
							1, 2, 3, 4, 5, 6, 7, 8,
						]),
					}),
					precision,
					base: faker.number.float({ min: 0.01, max: 100, fractionDigits: 2 }),
				});
				return {
					pricePerUnit: ppu,
					addFee: faker.datatype.boolean(),
					precision,
					quantity: faker.number.int({ min: 5, max: 99999 }).toString(),
				};
			});

			for (const payload of cases) {
				const result = service.getTotalAmount(payload);
				expect(spy.calledWithExactly(payload)).toBe(true);
				expect(result).toBeTruthy();
				expect(result).toBeInstanceOf(currencyJs);
				expect(result.toString().split(".")[1]?.length).toBe(
					payload.precision === service.FIAT_PRECISION
						? service.FIAT_PRECISION
						: service.CRYPTO_PRECISION,
				);
				if (!payload.addFee) {
					expect(result.toString()).toBe(
						currencyJs(payload.pricePerUnit, { precision: payload.precision })
							.multiply(payload.quantity)
							.toString(),
					);
				} else {
					const controlValue = currencyJs(payload.pricePerUnit, {
						precision: payload.precision,
					}).multiply(payload.quantity);
					const fee = controlValue.multiply(service.BASIS_POINTS);

					expect(result.toString()).toBe(controlValue.add(fee).toString());
				}
			}
		});
	});

	test.describe("[getTotalAmountCrypto]", () => {
		test("Should calculate total amount to pay in formatted in crypto as BigNumber", () => {
			const spy = sandbox.spy(service, "getTotalAmountCrypto");

			const cases = Array.from(Array(100), () => {
				const precision = faker.helpers.arrayElement([
					service.FIAT_PRECISION,
					service.CRYPTO_PRECISION,
				]);
				const ppu = service.getPricePerUnit({
					exchangeRate: faker.number.float({
						min: 0.00000001,
						max: 999.99,
						fractionDigits: faker.helpers.arrayElement([
							1, 2, 3, 4, 5, 6, 7, 8,
						]),
					}),
					precision,
					base: faker.number.float({ min: 0.01, max: 100, fractionDigits: 2 }),
				});
				return {
					pricePerUnit: ppu,
					addFee: faker.datatype.boolean(),
					precision,
					quantity: faker.number.int({ min: 5, max: 99999 }).toString(),
				};
			});

			for (const payload of cases) {
				const result = service.getTotalAmount(payload);

				const cryptoTokenDecimals = faker.helpers.arrayElement([6, 18]);
				const resultCrypto = service.getTotalAmountCrypto({
					amount: result.toString(),
					decimals: cryptoTokenDecimals,
				});

				expect(
					spy.calledWithExactly({
						amount: result.toString(),
						decimals: cryptoTokenDecimals,
					}),
				).toBe(true);
				expect(resultCrypto).toBeTruthy();
				expect(resultCrypto).toBeInstanceOf(BigNumber);
			}
		});
	});

	test.describe("Management fees calculation", () => {
		test("Should work in random cases", () => {
			const payloads = Array.from(Array(100), () => {
				const precision = faker.helpers.arrayElement([2, 8]);
				return {
					pricePerUnit: String(
						faker.number.float({
							min: 1.01,
							max: 99.99,
							fractionDigits: precision,
						}),
					),
					quantity: String(faker.number.int({ min: 1, max: 99999 })),
					addFee: faker.datatype.boolean(),
					precision,
				};
			});
			let index = 1;
			for (const payload of payloads) {
				const amount = service.getTotalAmount(payload)?.toString();
				const control = currencyJs(payload.pricePerUnit, {
					precision: payload.precision,
				}).multiply(payload.quantity);

				if (payload.addFee) {
					const amountWithoutFee = service.getTotalAmount({
						...payload,
						addFee: false,
					});

					const fee = amountWithoutFee.multiply(service.BASIS_POINTS);

					expect(
						amountWithoutFee,
						`Error: 
            Fee: ${fee}
            amount: ${amount}
            amountWithoutFee: ${amountWithoutFee}
            `,
					).not.toBe(amount);
					expect(amount).toBe(control.add(fee).toString());
				} else {
					expect(amount).toBe(control?.toString());
				}

				// // Value without fees from payload and mock response, not using the function
				// const controlValue = currency(mockResponse.value, { precision: 4 })
				//   .multiply(payload.base)
				//   .multiply(payload.quantity).value;

				// expect(rate).toBe(
				//   currency(mockResponse.value, { precision: 4 }).multiply(payload.base)
				//     .value
				// );

				// // If addManagementFee is true, the value should be increased by 0.02%
				// if (payload.addManagementFee) {
				//   const fees = currency(0.02, { precision: 4 }).divide(100).add(1);

				//   // result should be equal to the control value * fees
				//   expect(value).toBe(
				//     currency(controlValue, { precision: 4 }).multiply(fees).value
				//   );

				//   // Dividing the result by the fees should give us the original value
				//   expect(currency(value, { precision: 4 }).divide(fees.value).value).toBe(
				//     controlValue
				//   );
				// } else {
				//   expect(rate).toBe(
				//     Number((payload.base * mockResponse.value).toFixed(4))
				//   );
				//   expect(value).toBe(controlValue);
				// }
				// expect(countDecimalDigits(value)).toBeLessThan(5);
				index++;
			}
		});
	});
});
