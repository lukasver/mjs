import { AppNextApiRequest } from "@/_pages/api/_config";
import { isAdminAPI } from "@/_pages/api/auth/_utils";
import {
	IS_DEVELOPMENT,
	MAX_ALLOWANCE_WITHOUT_KYC,
} from "@/common/config/contants";
import prisma from "@/common/db/prisma";
import { LogSeverity } from "@/common/enums";
import nodeProvider, { isValidChainId } from "@/services/crypto/node.service";
import logger from "@/services/logger.service";
import Handlebars from "handlebars";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";

import { UserWithProfileAndAddress } from "@/common/types/user";
import {
	UrlContract,
	createContract,
	urlContract,
} from "@/services/adobe.service";
import { invariant } from "@epic-web/invariant";
import {
	Currency,
	FOP,
	Sale,
	SaleStatus,
	SaleTransactions,
	TransactionStatus,
} from "@prisma/client";
import currencyJs from "currency.js";
import { DbError, HttpError, getError } from "../errors";
import HttpStatusCode from "../httpStatusCodes";
import { checkSaleDateIsNotExpired } from "../sales/functions";

class TransactionsController {
	constructor() {
		this.createTransaction = this.createTransaction.bind(this);
	}

	async adminGetAllTransactions(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		try {
			if (!isAdminAPI(req)) {
				throw new HttpError(HttpStatusCode.FORBIDDEN, "Not authorized");
			}
			const transactions = await prisma.saleTransactions.findMany({
				include: {
					sale: true,
					user: {
						include: {
							profile: {
								select: {
									email: true,
								},
							},
						},
					},
				},
			});
			res
				.status(HttpStatusCode.OK)
				.json({ transactions: transactions, quantity: transactions?.length });
		} catch (e) {
			logger(e, LogSeverity.ERROR);
			res.status(e?.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				error: e.message,
				status: e?.status,
				...(e?.payload && { payload: e.payload }),
			});
		}
	}
	async adminUpdateTransaction(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { uuid, status } = req.body;
		if (!isAdminAPI(req)) {
			throw new HttpError(HttpStatusCode.FORBIDDEN, "Not authorized");
		}
		if (!uuid || !status) {
			throw new HttpError(HttpStatusCode.BAD_REQUEST, "Id and status required");
		}
		try {
			const transaction = await prisma.saleTransactions.update({
				where: {
					uuid: String(uuid),
				},
				data: {
					status: String(status) as TransactionStatus,
				},
				include: {
					sale: true,
					user: {
						include: {
							profile: {
								select: {
									email: true,
								},
							},
						},
					},
				},
			});
			res.status(HttpStatusCode.OK).json({ transaction });
		} catch (e) {
			logger(e, LogSeverity.ERROR);
			res.status(e?.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				error: e.message,
				status: e?.status,
				...(e?.payload && { payload: e.payload }),
			});
		}
	}

	async userTransactions(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { userId, formOfPayment, symbol, sale } = req.query;

		if (!userId) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"transactions uuid missing",
			);
		}
		let saleId: string | undefined;
		const andQuery: { saleId?: typeof saleId; tokenSymbol?: string }[] = [];
		if (sale === "current") {
			saleId = (await prisma.sale.findFirst({ where: { status: "OPEN" } }))
				?.uuid;
			andQuery.push({ saleId });
		}
		if (symbol) {
			andQuery.push({
				tokenSymbol: String(symbol),
			});
		}

		try {
			const transactions = await prisma.saleTransactions.findMany({
				where: {
					OR: [
						{
							userId: String(userId),
							...(!!formOfPayment && { formOfPayment: formOfPayment as FOP }),
						},
						{
							receivingWallet: String(userId),
							...(!!formOfPayment && { formOfPayment: formOfPayment as FOP }),
						},
					],
					...(andQuery.length && { AND: andQuery }),
				},
			});

			res.status(HttpStatusCode.OK).json({ transactions: transactions });
		} catch (e) {
			logger(e, LogSeverity.ERROR);
			res.status(e?.code || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				error: e.message,
				status: e?.status,
				...(e?.payload && { payload: e.payload }),
			});
		}
	}
	async createTransaction(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		let agreement: string | undefined;
		let urlSign: UrlContract["urlSign"] = null;
		let isSign: UrlContract["isSign"] = false;

		if (!req.body || !req.body.userId || !req.body.saleId) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"Transaction data missing or incomplete",
			);
		}
		const {
			tokenSymbol,
			boughtTokenQuantity,
			formOfPayment,
			receivingWallet,
			userId,
			saleId,
			comment,
			amountPaid,
			amountPaidCurrency,
		} = req.body;

		const sale = await prisma.sale.findUnique({
			where: { uuid: saleId },
		});
		if (!sale) {
			throw new HttpError(HttpStatusCode.BAD_REQUEST, "Sale not found");
		}
		if (
			sale.availableTokenQuantity &&
			sale.availableTokenQuantity < req.body.boughtTokenQuantity
		) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"Cannot buy more tokens than available amount",
				sale,
			);
		}
		checkSaleDateIsNotExpired(sale);

		const pendingTransaction = await prisma.saleTransactions.findFirst({
			where: {
				status: TransactionStatus.PENDING,
				saleId,
				userId,
			},
		});

		if (pendingTransaction) {
			throw new HttpError(
				HttpStatusCode.CONFLICT,
				"Cannot create a new transaction if user have a pending one",
				{ transaction: pendingTransaction },
			);
		}

		const userData = await prisma.user.findUnique({
			where: { sub: userId },
			include: {
				profile: {
					include: {
						address: true,
					},
				},
			},
		});

		if (req?.user?.isSiwe || userData?.isSiwe) {
			this.#checkMaxAllowanceWithoutKYC(boughtTokenQuantity, sale);
		}

		if (sale.saftContract && !userData?.isSiwe) {
			const contract = sale?.saftContract;
			const email = userData?.profile?.email;
			invariant(email, "User email not found in DB");
			const saleCurrency = sale?.saleCurrency;
			const saleTokenPricePerUnit = sale?.tokenPricePerUnit;

			const purchaseData = {
				currency: amountPaidCurrency,
				amount: amountPaid,
				quantity: boughtTokenQuantity,
				formOfPayment,
			};

			userData;

			const fullContract = createSaftContract({
				contract,
				userData,
				contractValues: purchaseData,
				saleCurrency,
				saleTokenPricePerUnit,
			});
			try {
				const {
					agreementId,
					urlSign: url,
					isSign: sign,
				} = await createContract(fullContract, email);
				agreement = agreementId;
				urlSign = url;
				isSign = sign;
			} catch (error) {
				throw new HttpError(
					HttpStatusCode.BAD_REQUEST,
					`Error creating agreement: ${error?.message}`,
				);
			}
		}

		try {
			const [_updatedSale, transaction] = await Promise.all([
				prisma.sale.update({
					where: {
						uuid: saleId,
					},
					data: {
						availableTokenQuantity: {
							decrement: parseInt(boughtTokenQuantity),
						},
					},
				}),
				prisma.saleTransactions.create({
					data: {
						tokenSymbol,
						boughtTokenQuantity: parseInt(boughtTokenQuantity),
						formOfPayment,
						receivingWallet,
						comment,
						status: TransactionStatus.PENDING,
						amountPaid,
						amountPaidCurrency,
						agreementId: agreement || null,
						sale: {
							connect: {
								uuid: saleId,
							},
						},
						user: {
							connect: {
								sub: userId,
							},
						},
					},
				}),
			]);
			if (!transaction) {
				throw new DbError("Error while creating sale");
			}
			return res
				.status(HttpStatusCode.CREATED)
				.json({ transaction, agreement, urlSign, isSign });
		} catch (error) {
			console.error(error?.message || error);
			res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				code: error.code,
				error: error.message,
				...(error?.payload && { payload: error.payload }),
			});
		}
	}
	async deleteTransactions(
		_req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		try {
			if (!IS_DEVELOPMENT) {
				throw new Error("NOT USABLE IN PROD");
			}
			const transaction = await prisma.saleTransactions.deleteMany();

			if (!transaction)
				throw new HttpError(HttpStatusCode.NOT_FOUND, "Delete tx not found");
			res.status(200).json({
				transaction,
			});
		} catch (error) {
			logger(error, LogSeverity.ERROR);
			res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				status: error?.status,
				error: error.message,
				...(error?.payload && { payload: error.payload }),
			});
		}
		return;
	}

	async deleteTransaction(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { transactionId } = req.query;
		if (!transactionId) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"Transaction uuid not provided",
			);
		}
		try {
			await prisma.saleTransactions.delete({
				where: {
					uuid: String(transactionId),
				},
			});
			res.status(200).end();
			return;
		} catch (error) {
			handleHttpError(res, error);
		}
	}

	async updateTransaction(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		const { uuid, statusTx, saleId, comment, confirmationId, txHash, chainId } =
			req.body;

		if (!uuid || !statusTx) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"Transaction id and Status missing",
			);
		}

		try {
			//  "CANCELLED" operations
			if (statusTx === TransactionStatus.CANCELLED && saleId) {
				const transaction = await prisma.saleTransactions.findUnique({
					where: { uuid },
				});

				await deleteTransactionAndRestoreUnits(transaction);

				res.status(HttpStatusCode.OK).json({ success: true, status: 200 });
				return;
			}
		} catch (error) {
			handleHttpError(res, error);
		}

		try {
			// General operation transactions
			const transaction = await prisma.saleTransactions.update({
				where: {
					uuid: uuid,
				},
				include: {
					sale: true,
					user: true,
					blockchain: true,
				},
				data: {
					status: statusTx,
					...(txHash && { txHash }),
					...(chainId && { blockchainId: chainId }),
					...(comment && { comment }),
					...(confirmationId && { confirmationId }),
				},
			});

			if (!transaction) {
				throw new HttpError(HttpStatusCode.NOT_FOUND, "Update tx not found");
			}

			res.status(HttpStatusCode.OK).json({
				transaction,
			});
		} catch (error) {
			handleHttpError(res, error);
		}
	}
	async pendingCronJobTransactions(
		_req: NextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
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
									TransactionStatus.CONFIRMED_BY_USER,
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
				for (const tx of cryptoTransactions) {
					// If there we know which blockchain the transaction has been broadcasted, then we can check
					if (tx.txHash && isValidChainId(tx.blockchainId)) {
						nodeProvider
							.getTransaction(tx.blockchainId, tx.txHash)
							.then((result) => {
								//transaction was confirmed in blockchain
								if (result && result.confirmations > 0) {
									prisma.saleTransactions.update({
										where: {
											uuid: tx.uuid,
										},
										data: {
											status: TransactionStatus.CONFIRMED,
										},
									});
								}
								// IF null then means transaction is pending, and by previous search, it has been pending for at least 6 hours.
								if (result === null) {
									cancelTransactionAndRestoreUnits(tx);
								}
							});
					} else {
						// If we have a pending crypto transaction without txHash we can assume it was never broadcasted by the user to the blockchain
						if (tx.status === TransactionStatus.PENDING) {
							cancelTransactionAndRestoreUnits(tx);
						}
					}
				}
			}

			res.status(HttpStatusCode.OK).json({ success: true, status: 200 });
			return;
		} catch (error) {
			handleHttpError(res, error);
		}
	}

	async pendingContactTransactions(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		try {
			if (!req.user?.id) {
				throw new HttpError(HttpStatusCode.UNAUTHORIZED, "Not authorized");
			}
			const sale = await prisma.sale.findFirst({ where: { status: "OPEN" } });
			if (!sale)
				throw new HttpError(
					HttpStatusCode.BAD_REQUEST,
					"There is no open sale",
				);

			const pendingTransaction = await prisma.saleTransactions.findFirst({
				where: {
					AND: [
						{ saleId: sale.uuid, userId: req.user.id },
						{ status: "PENDING" },
					],
				},
			});
			if (!pendingTransaction)
				throw new HttpError(
					HttpStatusCode.BAD_REQUEST,
					"There are no pending transactions",
				);

			let responseData = {};
			if (pendingTransaction.agreementId) {
				const data = await urlContract(pendingTransaction.agreementId);
				responseData = {
					isSign: data.isSign || null,
					urlSign: data.urlSign || null,
				};
			}

			res.status(HttpStatusCode.OK).json(responseData);
		} catch (error) {
			if (error instanceof HttpError) {
				res.status(HttpStatusCode.CONFLICT).json({ message: error.message });
			} else {
				console.error("Error in pendingContactTransactions function:", error);
				res
					.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
					.json({ message: "Internal server error" });
			}
		}
	}

	async userTransactionsForSale(
		req: AppNextApiRequest,
		res: NextApiResponse,
	): Promise<void> {
		try {
			const { id } = req.query;
			const status: TransactionStatus =
				TransactionStatus[String(req.query.type)] || TransactionStatus.PENDING;
			invariant(req.user, "User not found");
			invariant(id, "Sale not found");
			const { sub } = req.user;

			const transactions = await prisma.saleTransactions.findMany({
				where: {
					AND: [{ saleId: String(id) }, { userId: sub }, { status }],
				},
			});
			const transaction = transactions[0];

			let contract: UrlContract = { isSign: false, urlSign: null };

			if (transaction?.agreementId) {
				contract = await urlContract(transaction.agreementId);
			}

			return res
				.status(HttpStatusCode.OK)
				.json({ totalCount: transactions?.length, transactions, contract });
		} catch (e) {
			const error = getError(e);
			res.status(error.status).json({ message: error.message });
		}
	}

	#checkMaxAllowanceWithoutKYC(boughtTokenQuantity: string, sale: Sale) {
		if (
			!boughtTokenQuantity ||
			isNaN(parseInt(boughtTokenQuantity)) ||
			!sale?.tokenPricePerUnit
		) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				"Invalid token quantity or token price while checking max KYC allowance",
			);
		}
		if (
			parseInt(boughtTokenQuantity) * sale.tokenPricePerUnit >
			MAX_ALLOWANCE_WITHOUT_KYC
		) {
			throw new HttpError(
				HttpStatusCode.BAD_REQUEST,
				`SIWE users are entitled to make transactions up to ${MAX_ALLOWANCE_WITHOUT_KYC}${sale.saleCurrency} without KYC`,
			);
		}
	}
}

async function cancelTransactionAndRestoreUnits(
	tx: SaleTransactions,
	reason?: string,
) {
	return prisma.$transaction([
		prisma.sale.update({
			where: {
				uuid: tx.saleId,
			},
			data: {
				availableTokenQuantity: {
					increment: tx.boughtTokenQuantity,
				},
			},
		}),
		prisma.saleTransactions.update({
			where: {
				uuid: tx.uuid,
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

async function deleteTransactionAndRestoreUnits(transaction) {
	const { uuid, saleId, boughtTokenQuantity } = transaction;

	await prisma.$transaction([
		prisma.sale.update({
			where: {
				uuid: saleId,
			},
			data: {
				availableTokenQuantity: {
					increment: boughtTokenQuantity,
				},
			},
		}),
		prisma.saleTransactions.delete({
			where: {
				uuid,
			},
		}),
	]);
}

function handleHttpError(res: NextApiResponse, error: any) {
	logger(error, LogSeverity.ERROR);
	res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
		status: error?.status,
		error: error.message,
		...(error?.payload && { payload: error.payload }),
	});
}

const createSaftContract = ({
	contract,
	userData,
	contractValues,
	saleCurrency,
	saleTokenPricePerUnit,
}: {
	contract: string;
	userData: UserWithProfileAndAddress;
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

	const saleAmount = currencyJs(contractValues?.quantity, {
		precision,
	}).multiply(saleTokenPricePerUnit);

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
			currencyJs(contractValues?.amount, { precision })?.toString() || "XXXXX",
		defaultcurrency: saleCurrency || "XXXXX",
		paidamountindefaultcurrency: saleAmount?.toString() || "XXXXX",
		date: DateTime.now().toFormat("yyyy-MM-dd"),
	};

	const template = Handlebars.compile(contract);
	const fullContract = template(contractVariables);

	return fullContract;
};

const transactionsController = new TransactionsController();

export default transactionsController;
