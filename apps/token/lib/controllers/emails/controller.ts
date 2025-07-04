import { AppNextApiRequest } from '@/_pages/api/_config';
import prisma from '../../db/prisma';
import { LogSeverity } from '../../enums';
import EmailVerification from '@/components/EmailTemplates';
import logger from '@/services/logger.service';
import { invariant } from '@epic-web/invariant';
import { EmailVerificationStatus } from '@prisma/client';
import { NextApiResponse } from 'next';
import { Resend } from 'resend';
import { HttpError, isPrismaError } from '../errors';
import HttpStatusCode from '../httpStatusCodes';

class EmailController {
  async getTokenVerification(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    const { token } = req.query;
    invariant(req.user, 'UNAUTHORIZED');

    try {
      const response = await prisma.emailVerification.findUnique({
        where: {
          token: String(token),
        },
      });

      if (!response) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Token is incorrect');
      }
      if (response.expiredAt < new Date()) {
        await prisma.emailVerification.delete({
          where: { token: String(token) },
        });
        await prisma.user.update({
          where: { sub: req.user.id },
          data: { isEmailVerify: EmailVerificationStatus.NOTVERIFIED },
        });
        throw new HttpError(
          HttpStatusCode.BAD_REQUEST,
          'Token expired. Please re-enter your email to generate a new token.'
        );
      }

      const data = await prisma.profile.upsert({
        where: { userId: req.user.id },
        create: {
          userId: req.user.id,
          email: response.email,
          ...req.body,
        },
        update: {
          email: response.email,
          ...req.body,
        },
      });
      if (data) {
        await prisma.user.update({
          where: { sub: req.user.id },
          data: { isEmailVerify: EmailVerificationStatus.VERIFIED },
        });
      }
      await prisma.emailVerification.delete({
        where: { token: String(token) },
      });

      res.status(HttpStatusCode.ACCEPTED).json({ response });
    } catch (e) {
      logger(e, LogSeverity.ERROR);
      const status = e?.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        error: e?.message,
        status,
      });
    }
    return;
  }

  async createEmailVerification(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      invariant(req.user, 'UNAUTHORIZED');
      if (!req.body || !req.body.email || !req.body.token) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Invalid request body');
      }

      const { email, token, userId } = req.body;

      const verification = await prisma.emailVerification.create({
        data: { email, token, userId },
      });

      if (!verification) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Error creating token');
      }

      const updatedVerification = await prisma.user.update({
        where: { sub: req.user.id },
        data: { isEmailVerify: EmailVerificationStatus.PENDING },
      });
      if (!updatedVerification) {
        throw new HttpError(
          HttpStatusCode.BAD_REQUEST,
          'Error changing status'
        );
      }

      const sendResponse = await sendEmail({ email, token });
      if (!sendResponse) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, 'Error sending email');
      }

      res
        .status(HttpStatusCode.CREATED)
        .json({ message: 'Verification email sent successfully' });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
      });
    }
    return;
  }

  async daleteToken(
    req: AppNextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      await prisma.emailVerification.delete({
        where: { userId: req.user.id },
      });
      res.status(HttpStatusCode.CREATED).json({ message: 'Deleted Register' });
    } catch (error) {
      logger(error, LogSeverity.ERROR);
      if (isPrismaError(error)) {
        throw new HttpError(HttpStatusCode.BAD_REQUEST, error.message);
      }

      res.status(error?.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        message: error.message,
      });
    }
  }
}

const sendEmail = async ({ email, token }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return await resend.emails.send({
    from: 'SMAT S.A <devs@token.smat.io>',
    to: email,
    subject: 'Verification',
    react: EmailVerification({ token }),
  });
};

export default new EmailController();
