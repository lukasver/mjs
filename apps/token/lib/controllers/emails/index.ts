import 'server-only';
import { prisma } from '@/db';
import logger from '@/lib/services/logger.server';
import { templates } from '@mjs/emails';
import { invariant } from '@epic-web/invariant';
import { Resend } from 'resend';
import { ActionCtx } from '@/common/schemas/dtos/sales';
import { Failure, Success } from '@/common/schemas/dtos/utils';
import {
  GetTokenVerificationDto,
  CreateEmailVerificationDto,
  DeleteTokenDto,
} from '@/common/schemas/dtos/emails';

/**
 * EmailController class handles email verification operations.
 */
class EmailController {
  /**
   * Get and verify token for email verification.
   * @param dto - The token verification data.
   * @param ctx - The action context.
   * @returns Success with verification response, or Failure on error.
   */
  async getTokenVerification(
    dto: GetTokenVerificationDto,
    ctx: ActionCtx
  ): Promise<Success<{ response: unknown }> | Failure> {
    try {
      const { token } = dto;
      invariant(ctx.userId, 'UNAUTHORIZED');
      invariant(token, 'Token is required');

      const response = await prisma.verification.findFirst({
        where: {
          value: String(token),
          identifier: ctx.userId,
        },
      });

      if (!response) {
        return Failure('Token is incorrect', 400, 'Token is incorrect');
      }

      if (response.expiresAt < new Date()) {
        await prisma.verification.delete({
          where: { id: response.id },
        });
        return Failure(
          'Token expired. Please re-enter your email to generate a new token.',
          400,
          'Token expired'
        );
      }

      const data = await prisma.profile.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          email: response.identifier,
        },
        update: {
          email: response.identifier,
        },
      });

      if (data) {
        await prisma.user.update({
          where: { id: ctx.userId },
          data: { emailVerified: true },
        });
      }

      await prisma.verification.delete({
        where: { id: response.id },
      });

      return Success({ response });
    } catch (e) {
      logger(e);
      return Failure(e);
    }
  }

  /**
   * Create email verification record and send verification email.
   * @param dto - The email verification data.
   * @param ctx - The action context.
   * @returns Success with message, or Failure on error.
   */
  async createEmailVerification(
    dto: CreateEmailVerificationDto,
    ctx: ActionCtx
  ): Promise<Success<{ message: string }> | Failure> {
    try {
      invariant(ctx.userId, 'UNAUTHORIZED');
      invariant(dto.email, 'Email is required');
      invariant(dto.token, 'Token is required');
      invariant(dto.userId, 'User ID is required');

      const { email, token } = dto;

      const verification = await prisma.verification.create({
        data: {
          identifier: email,
          value: token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      invariant(verification, 'Error creating token');

      const updatedVerification = await prisma.user.update({
        where: { id: ctx.userId },
        data: { emailVerified: false },
      });

      invariant(updatedVerification, 'Error changing status');

      const sendResponse = await sendEmail({ email, token });
      invariant(sendResponse, 'Error sending email');

      return Success({ message: 'Verification email sent successfully' });
    } catch (error) {
      logger(error);
      return Failure(error);
    }
  }

  /**
   * Delete email verification token.
   * @param _dto - The delete token data (unused).
   * @param ctx - The action context.
   * @returns Success with message, or Failure on error.
   */
  async deleteToken(
    _dto: DeleteTokenDto,
    ctx: ActionCtx
  ): Promise<Success<{ message: string }> | Failure> {
    try {
      invariant(ctx.userId, 'UNAUTHORIZED');

      await prisma.verification.deleteMany({
        where: { identifier: ctx.userId },
      });

      return Success({ message: 'Deleted Register' });
    } catch (error) {
      logger(error);
      return Failure(error);
    }
  }
}

/**
 * Send verification email using Resend service.
 * @param email - The recipient email address.
 * @param token - The verification token.
 * @returns Promise with email send response.
 */
const sendEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  return await resend.emails.send({
    from: 'Mahjong Stars <notifications@mjs.smat.io>',
    to: email,
    subject: 'Email Verification',
    react: templates.emailVerification({ url: verificationUrl }),
  });
};

export default new EmailController();
