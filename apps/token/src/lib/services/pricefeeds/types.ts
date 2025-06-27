import { Currency } from "@prisma/client";
import { z } from "zod";

export const GetExchangeRate = z.record(
	z.nativeEnum(Currency),
	z.record(z.nativeEnum(Currency), z.number()),
);

export type GetExchangeRate = z.infer<typeof GetExchangeRate>;

export const isValidCurrencyTG = (data: unknown): data is Currency => {
	return Boolean(data) && Currency[data as Currency] !== undefined;
};
