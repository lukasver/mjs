import { Currency } from "@prisma/client";

export type Exclude<T, U> = T extends U ? never : T;

export type CryptoCurrency = Exclude<Currency, "CHF" | "USD" | "EUR" | "GBP">;
