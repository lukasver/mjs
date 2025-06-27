import { isCryptoCurrencyType } from "@/services/crypto/config";
import {
	Currency,
	FOP,
	PrismaClient,
	SaleTransactions,
	TransactionStatus,
} from "@prisma/client";
import presaleData from "../../data/presale.production.json";

export async function deleteAndRecreateOriginalSaleTransactions(
	prisma: PrismaClient,
) {
	const SALE_NAME = "Smat Token Private Sale - 1st Round";

	const sale = await prisma.sale.findFirst({
		where: {
			name: SALE_NAME,
		},
	});

	if (!sale) {
		throw new Error("Sale not found");
	}

	const usersWithTransactions = await prisma.user.findMany({
		where: {
			transactions: {
				some: {
					sale: {
						uuid: sale.uuid,
					},
				},
			},
		},
		include: {
			profile: {
				select: {
					email: true,
				},
			},
		},
	});

	if (usersWithTransactions?.length === 0) {
		throw new Error("No users with transactions found");
	}

	await prisma.saleTransactions.deleteMany({
		where: {
			sale: {
				name: SALE_NAME,
			},
		},
	});

	const parsed = presaleData
		.filter(({ isPaidPayment }) => !!isPaidPayment)
		.map(
			(tx) =>
				({
					username: tx.username,
					tokenSymbol: "SMAT",
					formOfPayment: isCryptoCurrencyType(tx.currency as Currency)
						? FOP.CRYPTO
						: FOP.TRANSFER,
					receivingWallet: tx.publicCryptoAddress,
					amountPaid: "-",
					status: TransactionStatus.CONFIRMED,
					amountPaidCurrency: tx.currency as Currency,
					boughtTokenQuantity: tx.totalNoOfPurchaseToken,
					createdAt: "2022-03-04T12:00:00Z" as unknown as Date,
					agreementId: tx.adobeAgreementDocumentId,
					uuid: tx.uuid,
				}) as Partial<SaleTransactions> & { username: string },
		);

	const result = await Promise.all(
		parsed
			.map(({ username, ...tx }) => {
				const user = usersWithTransactions.find(
					(u) => u.profile?.email === username,
				);
				if (user) {
					return prisma.saleTransactions.create({
						//@ts-expect-error wontfix
						data: {
							...tx,
							userId: user.sub,
							saleId: sale.uuid,
						},
					});
				}
			})
			.filter(Boolean),
	);

	console.debug("RESULT", result);
}
