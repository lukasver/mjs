import { ROLES } from '@/common/config/constants';
import { invariant } from '@epic-web/invariant';
import { Prisma, PrismaClient, SaleStatus } from '@prisma/client';
import { DateTime } from 'luxon';
import { defineChain } from 'thirdweb';
import { bscTestnet } from 'thirdweb/chains';

export async function seedOpenSale(prisma: PrismaClient) {
  invariant(
    process.env.NEXT_PUBLIC_MAIN_WALLET,
    'NEXT_PUBLIC_SMAT_WALLET is not set'
  );

  const user = await prisma.user.findUnique({
    where: {
      walletAddress: process.env.NEXT_PUBLIC_MAIN_WALLET,
      userRole: {
        some: {
          role: {
            name: {
              in: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
            },
          },
        },
      },
    },
  });
  invariant(user, 'User not found');

  const token = await prisma.tokensOnBlockchains.findFirst({
    where: {
      blockchain: {
        chainId: defineChain(bscTestnet.id).id,
      },
      token: {
        symbol: 'tMJS',
      },
    },
    include: {
      token: true,
      blockchain: true,
    },
  });
  invariant(token, 'Token not found');

  const response = await prisma.sale.create({
    data: {
      name: 'Test PreSale',
      saleStartDate: DateTime.now().toISO(),
      saleClosingDate: DateTime.now().plus({ year: 1 }).toISO(),
      saleCurrency: 'USD',
      tokenName: 'Smat',
      tokenSymbol: 'SMAT',
      initialTokenQuantity: 29_166_667,
      toWalletsAddress: process.env.NEXT_PUBLIC_TEST_WALLET!,
      tokenPricePerUnit: Prisma.Decimal('0.012'),
      saftCheckbox: false,
      status: SaleStatus.OPEN,
      tokenContractAddress: token.contractAddress,
      tokenContractChainId: token.blockchain.chainId,
      maximumTokenBuyPerUser: 10_000,
      minimumTokenBuyPerUser: 1,
      tokenTotalSupply: '29166667',
      tokenId: token.token.id,
      documents: {
        create: {
          name: 'Cover Picture',
          fileName: 'coverPicture.png',
          url: token.token.image || '',
          type: 'image/png',
          user: {
            connect: {
              id: user.id!,
            },
          },
        },
      },
      createdBy: user.id!,
    },
  });
  console.debug(`Sale created: ${response?.name} - ${response.id}`);
}
