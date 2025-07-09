import { Currency, FOP } from "@prisma/client";
import { BigNumber } from "ethers";
import { z } from "zod";
import { RegistrationSteps, UserRoles } from "../enums";

export interface LoginForm {
	username: string;
	password: string;
}

export interface IStorage {
	get<T>(key: string): unknown | T;
	save(key: string, value: unknown): void;
	delete(key: string): void;
	clear(): void;
}

export interface Auth {
	accessToken: string;
	currentEnvironment: "development" | "stage" | "uat" | "production" | "test";
	fullName: string;
	isRegistrationCompleted: boolean;
	isSignAgreement: boolean;
	refreshToken: string;
	registrationStep: RegistrationSteps;
	status: string;
	tokenExpiry: number;
	userRole: UserRoles;
	username: string;
	uuid: string;
	isEnableTfa?: boolean;
	phoneNumber?: string;
}

export interface TfaAuth {
	phoneNumber: string;
	username: string;
}

export const FormInvestSchema = z
	.object({
		formOfPayment: z.nativeEnum(FOP, {
			required_error: "Form of payment required",
			invalid_type_error: "Invalid form of payment",
		}),
		quantity: z.coerce
			.string()
			.min(1)
			.trim()
			.refine(
				(v) =>
					Number(v) &&
					Number(v) < Number.MAX_SAFE_INTEGER &&
					Number(v) > Number.MIN_SAFE_INTEGER,
				{ message: "Invalid quantity" },
			),
		address: z
			.string({
				invalid_type_error: "Invalid EVM compatible wallet",
				required_error: "EVM compatible wallet address required",
			})
			.regex(/^0x[a-fA-F0-9]{40}$/g)
			.trim(),
		// should handled as string to avoid math overflow and imprecission errors
		paymentAmount: z.coerce
			.string()
			.trim()
			.min(1)
			.refine((v) => !Number.isNaN(Number(v)) && Math.sign(Number(v)) === 1),
		paymentCurrency: z.nativeEnum(Currency, {
			invalid_type_error: "Invalid currency",
			required_error: "Currency required",
		}),
		paymentAmountCrypto: z.union([
			z.custom<BigNumber>(
				(val) => {
					return val instanceof BigNumber;
				},
				{
					message:
						"Invalid payment amount in crypto, should be an instance of BigNumber",
				},
			),
			z.literal(""),
		]),
	})
	.superRefine((values, ctx) => {
		if (values.formOfPayment === FOP.CRYPTO) {
			if (values.paymentAmountCrypto) {
				if (
					Number.isNaN(values.paymentAmount) &&
					!Number.isNaN(parseFloat(values.paymentAmount))
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Crypto shouldn't use floating point numbers for calculation`,
					});
				}
			} else {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Payment amount calculated in BigNumber required`,
				});
				return z.NEVER;
			}
		}
	});

export type FormInvestSchema = z.infer<typeof FormInvestSchema>;
