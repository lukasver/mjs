import { isCryptoCurrencyType } from "@/services/crypto/config";
import { Currency } from "@prisma/client";
import { ReactNode } from "react";

interface DisplayNumberFormatProps {
	value: string | number;
	prefix?: string | ReactNode;
	suffix?: string | ReactNode;
	currency?: Currency;
}
const formatNumber = (number) => {
	return new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	}).format(number);
};

export const thousandSeparator = (number, digits = 0) => {
	const format =
		typeof window === "undefined" ? "en-US" : (navigator?.language ?? "en-US");
	return new Intl.NumberFormat(format, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(number);
};

export function IntlNumberFormat(
	value: number,
	currency?: Currency,
	digits = 0,
) {
	const format = navigator?.language ?? "en-US";
	if (!currency || (currency && isCryptoCurrencyType(currency))) {
		return new Intl.NumberFormat(format, {
			maximumFractionDigits: digits,
		}).format(value);
	}
	return new Intl.NumberFormat(format, {
		style: "currency",
		currency: currency,
		maximumFractionDigits: digits,
	}).format(value);
}

export function formatNumToIntlString(
	arg: DisplayNumberFormatProps | DisplayNumberFormatProps["value"],
) {
	if (!arg) return null;
	if (typeof arg === "string" || typeof arg === "number") {
		return Number.isNaN(arg) ? String(arg) : IntlNumberFormat(Number(arg));
	}
	const { value, prefix = "", suffix = "", currency } = arg;
	if (Number.isNaN(Number(value))) {
		return `${prefix}${value}${suffix}`;
	}
	const formated = IntlNumberFormat(Number(value), currency);
	return `${prefix}${formated}${suffix}`;
}

export default formatNumber;
