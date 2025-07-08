import { prisma } from '@/db';
import { invariant } from '@epic-web/invariant';
import { SaleStatus } from '@prisma/client';
import { ActionCtx } from '@/common/schemas/dtos/sales';
import { Failure, Success } from '@/common/schemas/dtos/utils';
import logger from '@/services/logger.server';

class ContractController {
  async getContract(_dto: unknown, ctx: ActionCtx) {
    const { userId } = ctx;

    try {
      const sale = await prisma.sale.findFirst({
        where: { status: SaleStatus.OPEN },
        select: {
          id: true,
        },
      });
      invariant(sale, 'Sale not found or not open');

      const existingContract = await prisma.contractStatus.findFirst({
        where: { userId: userId as string, saleId: sale.id },
      });

      if (existingContract) {
        return Success({ contractStatus: existingContract });
      } else {
        return Success(null);
      }
    } catch (e) {
      logger(e);
      return Failure(e);
    }
  }

  async createContractStatus(dto: { contractId: string }, ctx: ActionCtx) {
    const { userId } = ctx;
    const { contractId } = dto;
    invariant(userId, 'Missing userId');
    try {
      const sale = await prisma.sale.findFirst({
        where: { status: SaleStatus.OPEN },
        select: {
          id: true,
        },
      });

      invariant(sale, 'Sale not found or not open');
      const { id: saleId } = sale;

      const newContract = await prisma.contractStatus.create({
        data: {
          userId: userId,
          saleId: saleId,
          contractId: contractId,
          status: 'PENDING',
        },
      });
      return Success({ contractStatus: newContract });
    } catch (e) {
      logger(e);
      return Failure(e);
    }
  }

  async deleteContractStatus(dto: { userId: string }, _ctx: ActionCtx) {
    const { userId } = dto;

    try {
      const existingContracts = await prisma.contractStatus.deleteMany({
        where: {
          userId,
        },
      });
      invariant(existingContracts.count > 0, 'Contracts not found');
      return Success({ message: 'Contracts deleted' });
    } catch (e) {
      logger(e);
      return Failure(e);
    }
  }

  async confirmSignature(_dto: unknown, _ctx: ActionCtx) {
    //TODO! implement this with documenso
    return Success({ message: 'Signature confirmed' });
  }
}

export default new ContractController();
