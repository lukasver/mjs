import "server-only";
import { MAX_ALLOWANCE_WITHOUT_KYC } from "@/common/config/constants";
import { ActionCtx } from "@/common/schemas/dtos/sales";
import {
	CreateTransactionDto,
	GetTransactionDto,
	UpdateTransactionDto,
} from "@/common/schemas/dtos/transactions";
import { Failure, Success } from "@/common/schemas/dtos/utils";
import { prisma } from "@/db";
import logger from "@/lib/services/logger.server";
import { invariant } from "@epic-web/invariant";
import {
	Currency,
	FOP,
	Sale,
	SaleStatus,
	SaleTransactions,
	TransactionStatus,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import Handlebars from "handlebars";
import { DateTime } from "luxon";
// import { urlContract, UrlContract } from '@/lib/services/adobe.service';

class TransactionsController {
	/**
	 * Get all transactions (admin only).
	 */
	async getAllTransactions(_dto: unknown, ctx: ActionCtx) {
		try {
			invariant(ctx.isAdmin, "Forbidden");
			const transactions = await prisma.saleTransactions.findMany({
				include: {
					sale: true,
					user: { include: { profile: true } },
				},
			});
			return Success({ transactions, quantity: transactions.length });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Update a transaction status (admin only).
	 * @param dto - Transaction update data
	 * @param ctx - Action context
	 */
	async adminUpdateTransaction(dto: UpdateTransactionDto, ctx: ActionCtx) {
		try {
			invariant(ctx.isAdmin, "Forbidden");
			invariant(dto.id, "Id missing");
			invariant(dto.status, "Status missing");
			const transaction = await prisma.saleTransactions.update({
				where: { id: String(dto.id) },
				data: { status: dto.status },
				include: {
					sale: true,
					user: {
						include: {
							profile: true,
						},
					},
				},
			});
			return Success({ transaction });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}

	/**
	 * Update a transaction (admin only).
	 */
	async updateTransactionStatus(
		dto: { id: string; status: TransactionStatus },
		ctx: ActionCtx,
	) {
		invariant(ctx.isAdmin, "Forbidden");
		invariant(dto.id, "Id missing");
		invariant(dto.status, "Status missing");
		try {
			const transaction = await prisma.saleTransactions.update({
				where: { id: String(dto.id) },
				data: { status: dto.status },
				include: { sale: true, user: { include: { profile: true } } },
			});
			return Success({ transaction });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Get all transactions for a user (optionally filtered by sale or symbol).
	 */
	async getUserTransactions(dto: GetTransactionDto, _ctx: ActionCtx) {
		try {
			const { userId, formOfPayment, tokenSymbol: symbol, saleId: sale } = dto;
			invariant(userId, "User id missing");
			let saleId: string | undefined = sale;
			const andQuery: { saleId?: string; tokenSymbol?: string }[] = [];
			if (sale === "current") {
				saleId = (
					await prisma.sale.findFirst({ where: { status: SaleStatus.OPEN } })
				)?.id;
				andQuery.push({ saleId });
			}
			if (symbol) andQuery.push({ tokenSymbol: symbol });
			const transactions = await prisma.saleTransactions.findMany({
				where: {
					OR: [
						{ userId, ...(formOfPayment && { formOfPayment }) },
						{
							receivingWallet: userId,
							...(formOfPayment && { formOfPayment }),
						},
					],
					...(andQuery.length && { AND: andQuery }),
				},
			});
			return Success({ transactions });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Create a new transaction.
	 */
	async createTransaction(dto: CreateTransactionDto, _ctx: ActionCtx) {
		try {
			const {
				tokenSymbol,
				quantity,
				formOfPayment,
				receivingWallet,
				userId,
				saleId,
				comment,
				amountPaid,
				amountPaidCurrency,
			} = dto;
			invariant(userId, "User id missing");
			invariant(saleId, "Sale id missing");
			const sale = await prisma.sale.findUnique({ where: { id: saleId } });
			invariant(sale, "Sale not found");

			if (
				sale.availableTokenQuantity &&
				sale.availableTokenQuantity < Number(quantity)
			) {
				return Failure("Cannot buy more tokens than available amount", 400);
			}
			// Check for pending transaction
			const pendingTransaction = await prisma.saleTransactions.findFirst({
				where: { status: TransactionStatus.PENDING, saleId, userId },
			});
			if (pendingTransaction) {
				invariant(
					false,
					"Cannot create a new transaction if user has a pending one",
				);
			}

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { isSiwe: true },
			});

			if (user?.isSiwe) {
				this.checkMaxAllowanceWithoutKYC(quantity.toString(), sale);
			}

			// TODO: Add contract/SAFT logic if needed
			// TODO: Calculate rawPrice, price, totalAmount correctly
			const [_updatedSale, transaction] = await Promise.all([
				prisma.sale.update({
					where: { id: saleId },
					data: { availableTokenQuantity: { decrement: Number(quantity) } },
				}),
				prisma.saleTransactions.create({
					data: {
						tokenSymbol,
						quantity: new Prisma.Decimal(Number(quantity)),
						formOfPayment,
						receivingWallet,
						comment,
						status: TransactionStatus.PENDING,
						amountPaid,
						amountPaidCurrency,
						saleId,
						userId,
						rawPrice: "0", // TODO: calculate
						price: new Prisma.Decimal(0), // TODO: calculate
						totalAmount: new Prisma.Decimal(0), // TODO: calculate
					},
				}),
			]);
			return Success({ transaction });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Delete all transactions (dev only).
	 */
	async deleteAllTransactions() {
		invariant(process.env.NODE_ENV === "development", "Forbidden");
		try {
			const transaction = await prisma.saleTransactions.deleteMany();
			return Success({ transaction });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Delete a transaction by id.
	 */
	async deleteTransaction(dto: { id: string }, _ctx: ActionCtx) {
		try {
			invariant(dto.id, "Transaction id missing");
			await prisma.saleTransactions.delete({ where: { id: String(dto.id) } });
			return Success({ id: dto.id });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Update a transaction by id.
	 */
	async updateTransactionById(
		dto: { id: string } & UpdateTransactionDto,
		_ctx: ActionCtx,
	) {
		try {
			invariant(dto.id, "Transaction id missing");
			const transaction = await prisma.saleTransactions.update({
				where: { id: String(dto.id) },
				data: { ...dto },
			});
			return Success({ transaction });
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	async pendingCronJobTransactions() {
		const sixHoursAgo = DateTime.local().minus({ hours: 6 }).toJSDate();
		// const oneMinuteAgo = DateTime.local().minus({ minutes: 1 }).toJSDate();

		try {
			const transactions = await prisma.saleTransactions.findMany({
				where: {
					AND: [
						{ status: TransactionStatus.PENDING },
						{ NOT: { formOfPayment: FOP.CRYPTO } },
						{
							sale: {
								status: SaleStatus.OPEN,
							},
						},
						{
							createdAt: { lte: sixHoursAgo },
						},
					],
				},
			});
			// Process transactions that are not paid in crypto
			if (transactions.length > 0) {
				await Promise.all(
					transactions.map((transaction) =>
						deleteTransactionAndRestoreUnits(transaction),
					),
				);
			}

			const cryptoTransactions = await prisma.saleTransactions.findMany({
				where: {
					AND: [
						{
							status: {
								in: [
									TransactionStatus.PAYMENT_VERIFIED,
									TransactionStatus.PENDING,
								],
							},
							formOfPayment: FOP.CRYPTO,
						},
						{
							sale: {
								status: SaleStatus.OPEN,
							},
						},
						{
							createdAt: { lte: sixHoursAgo },
						},
					],
				},
			});

			if (cryptoTransactions.length > 0) {
				//TODO: Implement this
				// for (const tx of cryptoTransactions) {
				//   // If there we know which blockchain the transaction has been broadcasted, then we can check
				//   if (tx.txHash && isValidChainId(tx.blockchainId)) {
				//     nodeProvider
				//       .getTransaction(tx.blockchainId, tx.txHash)
				//       .then((result) => {
				//         //transaction was confirmed in blockchain
				//         if (result && result.confirmations > 0) {
				//           prisma.saleTransactions.update({
				//             where: {
				//               uuid: tx.uuid,
				//             },
				//             data: {
				//               status: TransactionStatus.PAYMENT_VERIFIED,
				//             },
				//           });
				//         }
				//         // IF null then means transaction is pending, and by previous search, it has been pending for at least 6 hours.
				//         if (result === null) {
				//           cancelTransactionAndRestoreUnits(tx);
				//         }
				//       });
				//   } else {
				//     // If we have a pending crypto transaction without txHash we can assume it was never broadcasted by the user to the blockchain
				//     if (tx.status === TransactionStatus.PENDING) {
				//       cancelTransactionAndRestoreUnits(tx);
				//     }
				//   }
				// }
			}

			return Success({});
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Get pending contact transactions for a user in the current open sale.
	 */
	async pendingContactTransactions(_dto: unknown, ctx: ActionCtx) {
		try {
			invariant(ctx.userId, "Not authorized");
			const sale = await prisma.sale.findFirst({ where: { status: "OPEN" } });
			invariant(sale, "There is no open sale");
			const pendingTransaction = await prisma.saleTransactions.findFirst({
				where: {
					AND: [{ saleId: sale.id, userId: ctx.userId }, { status: "PENDING" }],
				},
			});
			invariant(pendingTransaction, "There are no pending transactions");
			let responseData = {};
			if (pendingTransaction.agreementId) {
				const data = await urlContract(pendingTransaction.agreementId);
				responseData = {
					isSign: data.isSign || null,
					urlSign: data.urlSign || null,
				};
			}
			return Success(responseData);
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Get user transactions for a specific sale.
	 */
	async userTransactionsForSale(
		dto: { saleId: string; status?: keyof typeof TransactionStatus },
		ctx: ActionCtx,
	) {
		try {
			const { saleId, status: _status } = dto;
			invariant(ctx.userId, "User not found");
			invariant(saleId, "Sale not found");
			const status: TransactionStatus =
				(_status && TransactionStatus[_status]) || TransactionStatus.PENDING;
			const transactions = await prisma.saleTransactions.findMany({
				where: {
					AND: [{ saleId: String(saleId) }, { userId: ctx.userId }, { status }],
				},
			});
			const transaction = transactions[0];
			let contract: UrlContract = { isSign: false, urlSign: null };
			if (transaction?.agreementId) {
				contract = await urlContract(transaction.agreementId);
			}
			return Success({
				totalCount: transactions?.length,
				transactions,
				contract,
			});
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	private checkMaxAllowanceWithoutKYC(boughtTokenQuantity: string, sale: Sale) {
		if (
			!boughtTokenQuantity ||
			isNaN(parseInt(boughtTokenQuantity)) ||
			!sale?.tokenPricePerUnit
		) {
			invariant(
				false,
				"Invalid token quantity or token price while checking max KYC allowance",
			);
		}
		if (
			parseInt(boughtTokenQuantity) * sale.tokenPricePerUnit >
			MAX_ALLOWANCE_WITHOUT_KYC
		) {
			invariant(
				false,
				`SIWE users are entitled to make transactions up to ${MAX_ALLOWANCE_WITHOUT_KYC}${sale.saleCurrency} without KYC`,
			);
		}
	}
}

async function _cancelTransactionAndRestoreUnits(
	tx: SaleTransactions,
	reason?: string,
) {
	return prisma.$transaction([
		prisma.sale.update({
			where: {
				id: tx.saleId,
			},
			data: {
				availableTokenQuantity: {
					increment: tx.quantity.toNumber(),
				},
			},
		}),
		prisma.saleTransactions.update({
			where: {
				id: tx.id,
			},
			data: {
				status: TransactionStatus.CANCELLED,
				comment:
					reason ||
					"Transaction cancelled for not being confirmed after time limit (Pending in Blockchain)",
			},
		}),
	]);
}

async function deleteTransactionAndRestoreUnits(transaction: SaleTransactions) {
	const { id, saleId, quantity } = transaction;

	await prisma.$transaction([
		prisma.sale.update({
			where: {
				id: saleId,
			},
			data: {
				availableTokenQuantity: {
					increment: quantity.toNumber(),
				},
			},
		}),
		prisma.saleTransactions.delete({
			where: {
				id,
			},
		}),
	]);
}

const _createSaftContract = ({
	contract,
	userData,
	contractValues,
	saleCurrency,
	saleTokenPricePerUnit,
}: {
	contract: string;
	//TODO! check this was UserWithProfileAndAddress
	userData: any;
	contractValues: {
		currency: Currency;
		amount: string | number;
		quantity: number;
		formOfPayment: FOP;
	};
	saleCurrency: Currency;
	saleTokenPricePerUnit: number;
}) => {
	const profile = userData?.profile;
	const address = profile?.address;

	const precision = contractValues?.formOfPayment === FOP.CRYPTO ? 8 : 2;

	const saleAmount = new Prisma.Decimal(contractValues?.quantity || 0)
		.mul(new Prisma.Decimal(saleTokenPricePerUnit))
		.toFixed(precision);

	const contractVariables = {
		firstname: profile?.firstName || "XXXXX",
		lastname: profile?.lastName || "XXXXX",
		email: profile?.email || "XXXXX",
		city: address?.city || "XXXXX",
		zipcode: address?.zipCode || "XXXXX",
		state: address?.state || "XXXXX",
		country: address?.country || "XXXXX",
		quantity: contractValues?.quantity || "XXXXX",
		paidcurrency: contractValues?.currency || "XXXXX",
		paidamount:
			new Prisma.Decimal(contractValues?.amount || 0)
				.toFixed(precision)
				.toString() || "XXXXX",
		defaultcurrency: saleCurrency || "XXXXX",
		paidamountindefaultcurrency: saleAmount?.toString() || "XXXXX",
		date: DateTime.now().toFormat("yyyy-MM-dd"),
	};

	const template = Handlebars.compile(contract);
	const fullContract = template(contractVariables);

	return fullContract;
};

export default new TransactionsController();
