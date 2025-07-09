import "server-only";
import {
	ActionCtx,
	GetSaleDto,
	GetSalesDto,
} from "@/common/schemas/dtos/sales";
import {
	CreateSaleDto,
	DeleteSaleDto,
	UpdateSaleDto,
	UpdateSaleStatusDto,
} from "@/common/schemas/dtos/sales";
import { Failure, Success } from "@/common/schemas/dtos/utils";
import { prisma } from "@/db";
import logger from "@/lib/services/logger.server";
import { invariant } from "@epic-web/invariant";
import { Currency, Prisma, Sale, SaleStatus } from "@prisma/client";
import { DateTime } from "luxon";
import {
	changeActiveSaleToFinish,
	checkSaleDateIsNotExpired,
} from "./functions";

const QUERY_MAPPING: { active: Prisma.SaleFindFirstArgs } = {
	active: {
		where: {
			status: SaleStatus.OPEN,
		},
		select: {
			name: true,
			status: true,
			availableTokenQuantity: true,
			saleCurrency: true,
			initialTokenQuantity: true,
			maximumTokenBuyPerUser: true,
			minimumTokenBuyPerUser: true,
			saleStartDate: true,
			tokenContractAddress: true,
			tokenName: true,
			tokenTotalSupply: true,
			tokenPricePerUnit: true,
			tokenSymbol: true,
			toWalletsAddress: true,
			saleClosingDate: true,
			createdBy: true,
			saftCheckbox: true,
			saftContract: true,
			token: {
				select: {
					TokensOnBlockchains: {
						select: {
							id: true,
							blockchain: {
								select: {
									chainId: true,
								},
							},
						},
					},
				},
			},
			saleInformation: {
				select: {
					summary: true,
					tokenUtility: true,
					tokenDistribution: true,
					otherInformation: true,
					tokenLifecycle: true,
					liquidityPool: true,
					futurePlans: true,
					useOfProceeds: true,
					imageSale: true,
					imageToken: true,
					contactEmail: true,
					saleId: true,
				},
			},
		},
	},
};

class SalesController {
	async getSales(
		{ active }: GetSalesDto = { active: false },
		_ctx: ActionCtx,
	): Promise<
		| Success<{
				sales: Sale[];
				quantity: number;
		  }>
		| Failure
	> {
		let query = {};
		const isActiveSaleReq = active;
		if (isActiveSaleReq) {
			query = QUERY_MAPPING["active"];
		}
		let sales: Sale[] = [];
		try {
			sales = await prisma.sale.findMany({
				...query,
				orderBy: [{ createdAt: "desc" }],
			});

			sales = sales.sort((a, b) => {
				const statusOrder = { CREATED: 1, OPEN: 0, CLOSED: 2, FINISHED: 3 };
				const statusComparison = statusOrder[a.status] - statusOrder[b.status];

				if (statusComparison === 0) {
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				}

				return statusComparison;
			});

			if (isActiveSaleReq && sales?.length) {
				const activeSale = sales[0];
				invariant(activeSale, "Active sale not found");
				const isSaleFinished =
					DateTime.fromJSDate(activeSale.saleClosingDate) <= DateTime.now();
				const isSaleCompleted =
					activeSale.availableTokenQuantity &&
					activeSale.availableTokenQuantity < 0;
				// if sale closing date is expired or no more available units to sell, then update status to finished.
				if (isSaleFinished || isSaleCompleted) {
					sales = await changeActiveSaleToFinish(activeSale);
				}
			}

			return Success({
				sales,
				quantity: sales?.length,
			});
		} catch (e) {
			logger(e);
			return Failure(e);
		}
	}

	/**
	 * Fetch a single sale and its information by id.
	 * @param dto - The DTO containing the sale id.
	 * @param _ctx - The action context (unused).
	 * @returns Success with sale and saleInformation, or Failure on error.
	 */
	async getSale(
		{ id }: GetSaleDto,
		_ctx: ActionCtx,
	): Promise<
		| Success<{
				sale: Sale;
				saleInformation: unknown;
		  }>
		| Failure
	> {
		if (!id) {
			return Failure("Sale id missing", 400, "Sale id missing");
		}
		try {
			const sale = await prisma.sale.findUnique({
				where: { id: String(id) },
			});
			invariant(sale, "Sale not found in DB");
			const saleInformation = await prisma.saleInformation.findUnique({
				where: { saleId: sale.id },
			});
			return Success({ sale, saleInformation });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}

	/**
	 * Create a new sale.
	 */
	async createSale(
		dto: CreateSaleDto,
		ctx: ActionCtx,
	): Promise<Success<{ sale: Sale }> | Failure> {
		try {
			const {
				name,
				tokenName,
				tokenSymbol,
				tokenContractAddress,
				tokenPricePerUnit,
				toWalletsAddress,
				saleCurrency,
				saleStartDate,
				saleClosingDate,
				initialTokenQuantity,
				availableTokenQuantity,
				minimumTokenBuyPerUser,
				maximumTokenBuyPerUser,
				saftCheckbox,
				saftContract,
				tokenId,
			} = dto;
			if (Number.isNaN(Number(tokenPricePerUnit))) {
				return Failure(
					"Invalid value as price per unit",
					400,
					"Invalid value as price per unit",
				);
			}
			if (!Object.values(Currency).includes(saleCurrency as Currency)) {
				return Failure("Invalid sale currency", 400, "Invalid sale currency");
			}
			const sale = await prisma.sale.create({
				data: {
					name,
					tokenName,
					tokenSymbol,
					tokenContractAddress,
					tokenPricePerUnit: parseFloat(Number(tokenPricePerUnit).toFixed(2)),
					toWalletsAddress,
					saleCurrency: saleCurrency as Currency,
					saleStartDate: new Date(saleStartDate),
					saleClosingDate: new Date(saleClosingDate),
					initialTokenQuantity,
					availableTokenQuantity,
					minimumTokenBuyPerUser,
					maximumTokenBuyPerUser,
					createdBy: ctx.userId || "",
					saftCheckbox,
					saftContract,
					tokenId,
				},
			});
			if (!sale) {
				return Failure(
					"Error while creating sale",
					500,
					"Error while creating sale",
				);
			}
			return Success({ sale }, { status: 201 });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}

	/**
	 * Update the status of a sale.
	 */
	async updateSaleStatus(
		{ id, status }: UpdateSaleStatusDto,
		_ctx: ActionCtx,
	): Promise<Success<{ sale: Sale }> | Failure> {
		if (!id) {
			return Failure("Sale id missing", 400, "Sale id missing");
		}
		if (!status || !Object.keys(SaleStatus).includes(String(status))) {
			return Failure(
				`Status should be one of: ${Object.keys(SaleStatus).join(" ")}`,
				400,
			);
		}
		if (status === SaleStatus.OPEN) {
			const openSale = await prisma.sale.findFirst({
				where: { status: SaleStatus.OPEN },
			});
			if (openSale) {
				return Failure(
					"Cannot have more than one sale open at same time",
					409,
					"Cannot have more than one sale open at same time",
				);
			}
		}
		try {
			const sale = await prisma.sale.findFirst({
				where: { id: String(id) },
			});
			invariant(sale, "Sale not found in DB");
			if (status === SaleStatus.OPEN) {
				checkSaleDateIsNotExpired(sale);
			}
			const updatedSale = await prisma.sale.update({
				where: { id: sale.id },
				data: { status: status as SaleStatus },
			});
			return Success({ sale: updatedSale });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}

	/**
	 * Update a sale.
	 */
	async updateSale(
		{ id, data }: UpdateSaleDto,
		_ctx: ActionCtx,
	): Promise<Success<{ sale: Sale }> | Failure> {
		if (!id || !data || data === undefined) {
			return Failure(
				"Invalid request parameters",
				400,
				"Invalid request parameters",
			);
		}
		try {
			const sale = await prisma.sale.findFirst({
				where: { id: String(id) },
			});
			invariant(sale, "Sale not found in DB");
			const updatedSale = await prisma.sale.update({
				where: { id: sale.id },
				data,
			});
			return Success({ sale: updatedSale });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}

	/**
	 * Delete a sale.
	 */
	async deleteSale(
		{ id }: DeleteSaleDto,
		_ctx: ActionCtx,
	): Promise<Success<{ id: string }> | Failure> {
		if (!id) {
			return Failure("Sale id missing", 400, "Sale id missing");
		}
		try {
			const sale = await prisma.sale.findUnique({
				where: { id: String(id) },
				include: { transactions: true },
			});
			if (!sale) {
				return Failure("Sale not found", 400, "Sale not found");
			}
			if (sale?.transactions?.length) {
				return Failure(
					"Cannot delete a sale with transactions associated. Change status to closed instead",
					400,
				);
			}
			if (sale.status === SaleStatus.OPEN) {
				return Failure(
					"Cannot delete an OPEN sale, update its status instead",
					400,
				);
			}
			await prisma.sale.delete({ where: { id: String(id) } });
			return Success({ id }, { status: 202 });
		} catch (error) {
			logger(error);
			return Failure(error);
		}
	}
}

export default new SalesController();
