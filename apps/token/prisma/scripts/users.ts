import { Prisma, PrismaClient } from '@prisma/client';

export async function seedUsers(
  _users: Array<Prisma.UserCreateInput>,
  prisma: PrismaClient
) {
  return prisma.user.createManyAndReturn({
    skipDuplicates: true,
    data: _users.map((user) => ({
      ...user,
      walletAddress: user.walletAddress,
    })),
  });
}
