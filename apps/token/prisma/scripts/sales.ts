import { faker } from "@faker-js/faker";
import { PrismaClient, SaleStatus } from "@prisma/client";
import { DateTime } from "luxon";

export async function seedOpenSale(prisma: PrismaClient) {
	const user = await prisma.user.findFirst({
		where: {
			profile: {
				email: "devs@smat.io",
			},
		},
	});

	const response = await prisma.sale.create({
		data: {
			name: "Smat Token Private Sale - 2nd Round",
			saleStartDate: DateTime.now().toISO(),
			saleClosingDate: DateTime.now().plus({ year: 1 }).toISO(),
			saleCurrency: "CHF",
			tokenName: "Smat",
			tokenSymbol: "SMAT",
			initialTokenQuantity: 1_000_000,
			toWalletsAddress: process.env.NEXT_PUBLIC_SMAT_WALLET,
			tokenPricePerUnit: 0.173,
			saftCheckbox: false,
			status: SaleStatus.OPEN,
			tokenContractAddress: faker.finance.ethereumAddress(),
			maximumTokenBuyPerUser: 10_000,
			minimumTokenBuyPerUser: 1,
			tokenTotalSupply: "1500000",
			coverPicture: "https://cdn.beta.smat.io/assets/ico-cover.webp",
			user: {
				connect: {
					uuid: user?.uuid,
				},
			},
		},
	});
	console.debug(`Sale created: ${response?.name} - ${response.uuid}`);
}
