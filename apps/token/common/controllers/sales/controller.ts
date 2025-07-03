import { AppNextApiRequest } from '@/_pages/api/_config';
import prisma from '../../db/prisma';
import { LogSeverity } from '../../enums';
import logger from '@/services/logger.service';
import { invariant } from '@epic-web/invariant';
import { Sale, SaleStatus } from '@prisma/client';
import { DateTime } from 'luxon';
import { NextApiResponse } from 'next';
import { DbError, HttpError } from '../errors';
import HttpStatusCode from '../httpStatusCodes';
import {
  changeActiveSaleToFinish,
  checkSaleDateIsNotExpired,
} from './functions';

const QUERY_MAPPING = {
  active: {
    where: {
      status: SaleStatus.OPEN,
    },
    include: {
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
  async getSales(req: AppNextApiRequest, res: NextApiResponse): Promise<void> {
    let query = {};
    const isActiveSaleReq = req.query?.active;
    if (isActiveSaleReq) {
      query = QUERY_MAPPING['active'];
    }
    let sales: Sale[] = [];
    try {
      sales = await prisma.sale.findMany({
        ...query,
        orderBy: [{ createdAt: 'desc' }],
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
        invariant(activeSale, 'Active sale not found');
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

      res.status(HttpStatusCode.OK).json({
        sales,
        quantity: sales?.length,
      });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error?.status,
        message: error?.message,
      });
    }
    return;
  }

  async getSale(req: AppNextApiRequest, res: NextApiResponse): Promise<void> {
    const { saleId } = req.query;

    if (!saleId) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Sale uuid missing');
    }
    try {
      const sale = await prisma.sale.findUnique({
        where: { uuid: String(saleId) },
      });

      invariant(sale, 'Sale not found in DB');
      const saleInformation = await prisma.saleInformation.findUnique({
        where: { saleId: sale.uuid },
      });

      res.status(HttpStatusCode.OK).json({ sale, saleInformation });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
        ...(error?.payload && { payload: error.payload }),
      });
    }
  }
  async createSale(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    if (!req.body) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Sale data missing');
    }

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
    } = req.body;
    if (Number.isNaN(Number(tokenPricePerUnit))) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        'Invalid value as price per unit'
      );
    }
    try {
      const sale = await prisma.sale.create({
        data: {
          name,
          tokenName,
          tokenSymbol,
          tokenContractAddress,
          tokenPricePerUnit: parseFloat(Number(tokenPricePerUnit).toFixed(2)),
          toWalletsAddress,
          saleCurrency,
          saleStartDate: new Date(saleStartDate),
          saleClosingDate: new Date(saleClosingDate),
          initialTokenQuantity,
          availableTokenQuantity,
          minimumTokenBuyPerUser,
          maximumTokenBuyPerUser,
          createdBy: req.user.id || req.user.sub!,
          saftCheckbox,
          saftContract,
        },
      });
      if (!sale) {
        throw new DbError('Error while creating sale');
      }
      res.status(HttpStatusCode.CREATED).json({ sale });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
      });
    }
    return;
  }
  async updateSaleStatus(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    const { saleId } = req.query;
    const { status } = req.body;
    if (!saleId) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Sale uuid missing');
    }
    if (!status || !Object.keys(SaleStatus).includes(String(status))) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        `Status should be one of: ${Object.keys(SaleStatus).join(' ')}`
      );
    }
    //If request ask to open a sale, check if there is another one open first
    if (status === SaleStatus.OPEN) {
      const openSale = await prisma.sale.findFirst({
        where: {
          status: SaleStatus.OPEN,
        },
      });
      if (openSale) {
        res.statusCode = HttpStatusCode.CONFLICT;
        throw new HttpError(
          HttpStatusCode.CONFLICT,
          'Cannot have more than one sale open at same time',
          openSale
        );
      }
    }

    try {
      const sale = await prisma.sale.findFirst({
        where: { uuid: String(saleId) },
      });

      invariant(sale, 'Sale not found in DB');

      if (status === SaleStatus.OPEN) {
        checkSaleDateIsNotExpired(sale);
      }

      const updatedSale = await prisma.sale.update({
        where: { uuid: sale.uuid },
        data: { status: status as SaleStatus },
      });

      res.status(HttpStatusCode.OK).json({ sale: updatedSale });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
        ...(error?.payload && { payload: error.payload }),
      });
    }
  }

  async updateSale(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    const { saleId } = req.query;
    const data = req.body;

    if (!saleId || !data || data === undefined) {
      throw new HttpError(
        HttpStatusCode.BAD_REQUEST,
        'Invalid request parameters'
      );
    }

    try {
      const sale = await prisma.sale.findFirst({
        where: { uuid: String(saleId) },
      });
      invariant(sale, 'Sale not found in DB');

      const updatedSale = await prisma.sale.update({
        where: { uuid: sale.uuid },
        data,
      });

      res.status(HttpStatusCode.OK).json({ sale: updatedSale });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
        ...(error?.payload && { payload: error.payload }),
      });
    }
  }

  async deleteSale(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    const { saleId } = req.query;
    if (!saleId) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Sale uuid missing');
    }
    try {
      const sale = await prisma.sale.findUnique({
        where: {
          uuid: String(saleId),
        },
        include: {
          transactions: true,
        },
      });

      if (!sale) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Sale not found');
      }
      if (sale?.transactions?.length) {
        throw new HttpError(
          HttpStatusCode.BAD_REQUEST,
          'Cannot delete a sale with transactions associated. Change status to closed instead'
        );
      }
      if (sale.status === SaleStatus.OPEN) {
        throw new HttpError(
          HttpStatusCode.BAD_REQUEST,
          'Cannot delete an OPEN sale, update its status instead'
        );
      }
      await prisma.sale.delete({
        where: {
          uuid: String(saleId),
        },
      });
      res.status(HttpStatusCode.ACCEPTED).json({ uuid: saleId });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
      });
    }
  }
}

export default new SalesController();
