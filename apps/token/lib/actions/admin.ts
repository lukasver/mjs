import { invariant } from '@epic-web/invariant';
import { authActionClient } from './config';
import { prisma } from '@/common/db/prisma';

const adminMiddleware: Parameters<typeof authActionClient.use>[0] = async ({
  next,
  ctx,
}) => {
  const authed = await prisma.user.findUnique({
    where: {
      walletAddress: ctx.address,
      userRole: {
        some: {
          role: {
            name: {
              in: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
  invariant(authed, 'Forbidden');
  return next({
    ctx: {
      ...ctx,
      isAdmin: true,
      userId: authed.id,
    },
  });
};

/**
 * Use this client for sensistive administrative actions only
 */
export const adminClient = authActionClient.use(adminMiddleware);
