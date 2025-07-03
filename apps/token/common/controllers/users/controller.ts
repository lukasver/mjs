import { AppNextApiRequest } from '@/_pages/api/_config';
import prisma from '../../db/prisma';
import { LogSeverity, RegistrationSteps } from '../../enums';
import logger from '@/services/logger.service';
import { NextApiResponse } from 'next';
import { HttpError } from '../errors';
import HttpStatusCode from '../httpStatusCodes';
import { checkAndAssignRole } from './functions';

class UsersController {
  async me(req: AppNextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          sub: req.user.id,
        },
        include: {
          profile: {
            include: {
              address: true,
            },
          },
        },
      });
      // if (!user)
      //   throw new HttpError(HttpStatusCode.NOT_FOUND, 'User not found');
      res.status(200).json({
        user,
      });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error?.status,
        error: error.message,
      });
    }
    return;
  }
  async createUser(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      if (!req.body) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'User data missing');
      }
      //todo: promoCode implementation
      const { address, dateOfBirth, promoCode, ...data } = req.body;

      if (promoCode) {
        checkAndAssignRole({ code: promoCode, user: req.user });
      }
      cleanData(data);

      await prisma.address.upsert({
        where: {
          userId: req.user.id,
        },
        create: {
          userId: req.user.id,
          ...address,
        },
        update: {
          ...address,
        },
      });

      const user = await prisma.profile.update({
        where: {
          userId: req.user.id,
        },
        include: {
          user: true,
        },
        data: {
          ...data,
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          user: {
            update: {
              registrationStep: RegistrationSteps.COMPLETED,
            },
          },
        },
      });

      if (!user) {
        throw new HttpError(HttpStatusCode.NOT_FOUND, 'User not found');
      }
      res
        .status(HttpStatusCode.CREATED)
        .json({ status: HttpStatusCode.CREATED });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error?.status,
        error: error?.message,
      });
    }
    return;
  }

  async updateUser(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      if (!req.body) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'User data missing');
      }

      //todo: sanitize body
      if (req.body.email) {
        const response = await prisma.profile.upsert({
          where: { userId: req.user.id },
          create: {
            userId: req.user.id,
            ...req.body,
          },
          update: {
            ...req.body,
          },
        });
        res.status(HttpStatusCode.CREATED).json({ profile: response });
      }

      const response = await prisma.user.upsert({
        where: {
          sub: req.user.id,
        },
        create: {
          sub: req.user.id,
          ...req.body,
        },
        update: {
          ...req.body,
        },
      });
      res.status(HttpStatusCode.CREATED).json({ user: response });
    } catch (e) {
      logger(e, LogSeverity.ERROR);
      const status = e?.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        error: e?.message,
        status,
      });
    }
  }
}

export default new UsersController();
const cleanData = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
};
