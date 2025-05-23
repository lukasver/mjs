import { Currency, FOP, PrismaClient, TransactionStatus } from "@prisma/client";
import { z } from "zod";
import presaleData from "../../data/presale.production.json";

import crypto from "crypto";
import { isCryptoCurrencyType } from "@/services/crypto/config";
import { faker } from "@faker-js/faker";

// @ts-expect-error wontfix
const saleData: jsonSchema = presaleData;

const saleStartDate = new Date("2022-02-01T00:00:00Z");
const saleClosingDate = new Date("2022-03-01T23:59:59Z");
const randomUUID = crypto.randomUUID();
const IS_DEVELOPMENT =
	process.env.NODE_ENV !== "production" ||
	process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
const SMAT_WALLET_ADDRESS = IS_DEVELOPMENT
	? process.env.NEXT_PUBLIC_TEST_WALLET || process.env.NEXT_PUBLIC_SMAT_WALLET
	: process.env.NEXT_PUBLIC_SMAT_WALLET;

export async function seedTransactions(prisma: PrismaClient) {
	let commonSale;

	console.log(
		`Seeding transactions in 5s for ${IS_DEVELOPMENT ? "development" : "production"}`,
	);
	await setTimeout(() => {}, 5000);

	const createdByUser = await prisma.user.upsert({
		where: { sub: randomUUID },
		create: {
			sub: randomUUID,
			profile: { create: { email: "devs@smat.io" } },
		},
		update: {
			sub: randomUUID,
		},
	});

	if (createdByUser) {
		commonSale = await prisma.sale.create({
			data: {
				name: "Smat Token Private Sale - 1st Round",
				initialTokenQuantity: 100_000,
				tokenName: "SMAT",
				tokenPricePerUnit: 0.1,
				tokenSymbol: "SMAT",
				toWalletsAddress: SMAT_WALLET_ADDRESS,
				saleStartDate: saleStartDate.toISOString(),
				saleClosingDate: saleClosingDate.toISOString(),
				createdBy: createdByUser?.sub as string,
			},
		});
	}

	const parsed = saleData
		// Only consider those who confirmed payment
		.filter(({ isPaidPayment }) => !!isPaidPayment)
		.map((user) => {
			const firstName = IS_DEVELOPMENT
				? faker.person.firstName()
				: user.firstName;
			const lastName = IS_DEVELOPMENT ? faker.person.lastName() : user.lastName;
			const email =
				user.username === "l.verdiell@gmail.com"
					? user.username
					: IS_DEVELOPMENT
						? faker.internet.email()
						: user.username;
			return {
				sub: user.uuid,
				profile: {
					create: {
						name: `${firstName} ${lastName}`,
						firstName,
						lastName,
						loginName: email,
						email: email,
						walletAddress: user.publicCryptoAddress,
						address: {
							create: {
								city: user.city,
								zipCode: user.zipCode,
								country: user.country,
								state: user.state,
								street: IS_DEVELOPMENT ? faker.location.street() : user.street,
							},
						},
						phoneNumber: IS_DEVELOPMENT
							? faker.phone.number()
							: user.phoneNumber,
						dateOfBirth: IS_DEVELOPMENT
							? faker.date.past().toISOString()
							: user.dateOfBirth,
					},
				},
				transactions: {
					create: [
						{
							tokenSymbol: "SMAT",
							formOfPayment: isCryptoCurrencyType(user.currency)
								? FOP.CRYPTO
								: FOP.TRANSFER,
							receivingWallet: user.publicCryptoAddress,
							amountPaid: "-",
							status: TransactionStatus.CONFIRMED,
							amountPaidCurrency: user.currency as Currency,
							boughtTokenQuantity: user.totalNoOfPurchaseToken,
							sale: { connect: { uuid: commonSale.uuid } },
							createdAt: "2022-03-04T12:00:00Z",
							agreementId: user.adobeAgreementDocumentId,
						},
					],
				},
			};
		});

	const results = await Promise.allSettled(
		parsed.map((user) => prisma.user.create({ data: user })),
	);

	const success: (typeof results)[number][] = [];
	const errors: (typeof results)[number][] = [];
	results.forEach((result) => {
		if (result.status === "fulfilled") {
			success.push(result);
		} else {
			errors.push(result);
		}
	});
	console.log(`Datos importados correctamente: ${success.length} usuarios`);
	if (errors?.length) {
		console.log(`Usuarios no creados por errores: ${errors.length} usuarios`);
	}
}

const jsonSchema = z.array(
	z.object({
		adobeAgreementDocumentId: z.union([z.string(), z.null()]),
		adobeTransientDocumentId: z.union([z.string(), z.null()]),
		birthCountry: z.union([z.string(), z.null()]),
		city: z.string(),
		country: z.string(),
		currency: z.nativeEnum(Currency),
		dateOfBirth: z.string(),
		firstName: z.string(),
		isContractGenerated: z.boolean(),
		isContractSigned: z.boolean(),
		isGeneratedDocument: z.boolean(),
		isPaidPayment: z.nativeEnum(FOP),
		lastName: z.string(),
		phoneNumber: z.string(),
		publicCryptoAddress: z.union([z.string(), z.null()]),
		signAgreementPath: z.union([z.string(), z.null()]),
		state: z.union([z.string(), z.null()]),
		street: z.string(),
		totalNoOfPurchaseToken: z.number(),
		userIdUrl: z.string(),
		username: z.string(),
		uuid: z.string(),
		zipCode: z.string(),
	}),
);

type jsonSchema = z.infer<typeof jsonSchema>;
