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
  serverClient,
  setSessionCookie,
  verifyAuthPayload,
  verifyJwt,
} from '../auth/thirdweb';
import { prisma } from '@/db';
import { invariant } from '@epic-web/invariant';
import salesController from '@/lib/controllers/sales/controller';
import usersController from '@/lib/controllers/users/controller';
import { GetSalesDto } from '@/common/schemas/dtos/sales';
import { authCache } from '../auth/cache';
import { defineChain, getContract as getContractThirdweb } from 'thirdweb';
import { bscTestnet } from 'thirdweb/chains';
import { erc20Abi } from 'viem';

export const isLoggedIn = loginActionClient
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const data = await getSessionCookie();
    console.log('IS LOGGED IN CALLED', data);
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
      select: {
        id: true,
        expiresAt: true,
      },
    });
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
    const [jwt] = await Promise.all([
      generateJWT(payload, {
        address: payload.address,
        ...(payload.chain_id && { chainId: payload.chain_id }),
      }),
    ]);
    await setSessionCookie(jwt);
    const user = await usersController.createUser({
      address: payload.address,
      session: {
        jwt,
        expirationTime: payload.expiration_time,
      },
      chainId: payload.chain_id ? Number(payload.chain_id) : undefined,
    });
    invariant(user, 'User could not be found/created');
    console.debug('Redirecting to dashboard...');
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
  const data = String((await getSessionCookie()) || '');

  await deleteSessionCookie();
  if (data) {
    const verified = await verifyJwt(data);
    void Promise.allSettled([
      verified.valid && authCache.delete(verified.parsedJWT.sub),
      prisma.session
        .delete({
          where: {
            token: data,
          },
        })
        .catch((e) => {
          console.error(
            '🚀 ~ index.ts:122 ~ e:',
            e instanceof Error ? e.message : e
          );
        }),
    ]);
  }
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
            address: true,
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

export const getContract = authActionClient
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const contract = await getContractThirdweb({
      // the client you have created via `createThirdwebClient()`
      client: serverClient,
      // the chain the contract is deployed on
      chain: defineChain(bscTestnet.id),
      // the contract's address
      address: parsedInput,
      // OPTIONAL: the contract's abi
      // abi: [...],
      abi: erc20Abi,
    });
    invariant(contract, 'Contract not found');

    return;
  });
