'use server';
import 'server-only';
import { loginActionClient, authActionClient } from './config';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import {
  deleteSessionCookie,
  generateAuthPayload,
  generateJWT,
  getSessionCookie,
  setSessionCookie,
  verifyAuthPayload,
} from '../auth/thirdweb';
import { prisma } from '@/common/db/prisma';
import { publicUrl } from '@/common/config/env';
import { headers } from 'next/headers';
import { getIpAddress, getUserAgent } from '../geo';
import { invariant } from '@epic-web/invariant';
import salesController from '@/common/controllers/sales/controller';
import { GetSalesDto } from '@/common/schemas/dtos/sales';

export const isLoggedIn = loginActionClient
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    // const data = await auth.api.getSession({
    //   headers: await headers(),
    // });
    const data = await getSessionCookie();
    if (!data) return false;

    const sessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
        token: data,
        user: {
          walletAddress: parsedInput,
        },
      },
    });
    console.debug('🚀 ~ index.ts:78 ~ sessions:', sessions);
    // If there is at least one active session
    return sessions.length > 0;
  });

const LoginParams = z.object({
  signature: z.string(),
  payload: z.object({
    address: z.string(),
    chain_id: z.string().optional(),
    domain: z.string(),
    expiration_time: z.string(),
    invalid_before: z.string(),
    issued_at: z.string(),
    nonce: z.string(),
    statement: z.string(),
    version: z.string(),
    uri: z.string().optional(),
    resources: z.array(z.string()).optional(),
    temp: z.string().optional(),
  }),
});

export type LoginParams = z.infer<typeof LoginParams>;

export const login = loginActionClient
  .schema(LoginParams)
  .action(async ({ parsedInput }) => {
    const verifiedPayload = await verifyAuthPayload(parsedInput);

    if (!verifiedPayload.valid) {
      redirect('/?error=invalid_payload');
    }

    const { payload } = verifiedPayload;
    // Here should go the JWT logic
    const [h, jwt] = await Promise.all([
      headers(),
      generateJWT(payload, {
        address: payload.address,
        ...(payload.chain_id && { chainId: payload.chain_id }),
      }),
    ]);
    await setSessionCookie(jwt);
    const email = `temp_${payload.address}@${new URL(publicUrl).hostname}`;
    try {
      const [user] = await Promise.all([
        prisma.user.upsert({
          where: {
            walletAddress: payload.address,
          },
          update: {},
          create: {
            externalId: payload.address,
            walletAddress: payload.address,
            email,
            emailVerified: false,
            name: 'Anonymous',
            isSiwe: true,
            profile: {
              create: {},
            },
            sessions: {
              create: {
                token: jwt,
                expiresAt: new Date(payload.expiration_time),
                ipAddress: getIpAddress(new Headers(h)),
                userAgent: getUserAgent(new Headers(h)),
              },
            },
            // ...(payload.chain_id
            //   ? {
            //       WalletAddress: {
            //         connectOrCreate: {
            //           where: {
            //             walletAddress_chainId: {
            //               chainId: payload.chain_id,
            //               walletAddress: payload.address,
            //             },
            //           },
            //           create: {
            //             chainId: payload.chain_id,
            //           },
            //         },
            //       },
            //     }
            //   : {}),
            // userRole: {
            //   connect: {

            //   }
            // }
          },
        }),
      ]);
      console.debug('🚀 ~ CREATED USER:', user);
    } catch (e) {
      console.debug('PRISMA ERROR:', e instanceof Error ? e?.message : e);
    }
    redirect('/dashboard');
  });

export const generatePayload = loginActionClient
  .schema(
    z.object({
      address: z.string(),
      chainId: z.coerce.number(),
    })
  )
  .action(async ({ parsedInput: { chainId, address } }) => {
    return await generateAuthPayload({ chainId, address });
  });

export const logout = loginActionClient.action(async () => {
  // await auth.api.signOut({
  //   headers: await headers(),
  // });
  //TODO do other session related stuff to logout
  await deleteSessionCookie();
  redirect('/');
});

export const getCurrentUser = authActionClient.action(
  async ({ ctx: { address } }) => {
    // const user = await getUser({
    //   client,
    //   email: address,
    //   // walletAddress: address,
    // });
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: address,
      },
      select: {
        id: true,
        email: true,
        name: true,
        externalId: true,
        walletAddress: true,
        emailVerified: true,
        isSiwe: true,
        image: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true,
          },
        },
        // sessions: {
        //   select: {},
        // },
      },
    });

    return user;
  }
);

export const getCurrentUserEmail = authActionClient.action(
  async ({ ctx: { address } }) => {
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: address,
      },
      select: {
        email: true,
      },
    });
    invariant(user, 'User not found');
    return user.email;
  }
);

export const getSales = authActionClient
  .schema(GetSalesDto)
  .action(async ({ ctx, parsedInput }) => {
    const sales = await salesController.getSales(parsedInput, ctx);
    return sales;
  });
