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
import salesController from '@/lib/controllers/sales';
import usersController from '@/lib/controllers/users';
import transactionsController from '@/lib/controllers/transactions';
import ratesController from '@/lib/controllers/feeds/rates';
import contractController from '@/lib/controllers/contract';
import salesInformationController from '@/lib/controllers/salesInformation';
import {
  CreateSaleDto,
  DeleteSaleDto,
  GetSalesDto,
  UpdateSaleDto,
  UpdateSaleStatusDto,
} from '@/common/schemas/dtos/sales';
import { authCache } from '../auth/cache';
import { defineChain, getContract as getContractThirdweb } from 'thirdweb';
import { bscTestnet } from 'thirdweb/chains';
import { erc20Abi } from 'viem';
import { ROLES } from '@/common/config/constants';
import {
  CurrencySchema,
  ProfileSchema,
  UserSchema,
} from '@/common/schemas/generated';
import {
  CreateSaleInformationDto,
  UpdateSaleInformationDto,
} from '@/common/schemas/dtos/sales/information';
import {
  CancelAllTransactionsDto,
  CreateTransactionDto,
  GetTransactionDto,
  UpdateTransactionDto,
} from '@/common/schemas/dtos/transactions';
import { TransactionStatus } from '@prisma/client';
import { CreateContractStatusDto } from '@/common/schemas/dtos/contracts';

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
        userRole: {
          select: {
            role: true,
          },
        },
        // sessions: {
        //   select: {},
        // },
      },
    });
    invariant(user, 'User not found');
    const { userRole, ...rest } = user;
    const roles = userRole.reduce((acc, role) => {
      acc[role.role.name as keyof typeof ROLES] = role.role.id;
      return acc;
    }, {} as Record<keyof typeof ROLES, string>);

    return { ...rest, roles };
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
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
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

export const updateUserInfo = authActionClient
  .schema(
    z.object({
      user: UserSchema.omit({ id: true }).partial(),
      profile: ProfileSchema.omit({ userId: true, id: true })
        .partial()
        .optional(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const sales = await usersController.updateUser(parsedInput, ctx);
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const getAllTransactions = authActionClient.action(async ({ ctx }) => {
  const sales = await transactionsController.pendingContactTransactions(
    {},
    ctx
  );
  if (!sales.success) {
    throw new Error(sales.message);
  }
  return sales.data;
});

export const getUserTransactions = authActionClient
  .schema(GetTransactionDto)
  .action(async ({ ctx, parsedInput }) => {
    const transactions = await transactionsController.getUserTransactions(
      parsedInput,
      ctx
    );
    if (!transactions.success) {
      throw new Error(transactions.message);
    }
    return transactions.data;
  });

export const createTransaction = authActionClient
  .schema(CreateTransactionDto)
  .action(async ({ ctx, parsedInput }) => {
    const transactions = await transactionsController.createTransaction(
      parsedInput,
      ctx
    );
    if (!transactions.success) {
      throw new Error(transactions.message);
    }
    return transactions.data;
  });

export const confirmTransaction = authActionClient
  .schema(
    UpdateTransactionDto.extend({
      id: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const transaction = await transactionsController.updateTransactionById(
      parsedInput,
      ctx
    );
    if (!transaction.success) {
      throw new Error(transaction.message);
    }
    return transaction.data;
  });

export const getExchangeRate = authActionClient
  .schema(
    z.object({
      from: CurrencySchema,
      to: CurrencySchema,
    })
  )
  .action(async ({ parsedInput }) => {
    const { from, to } = parsedInput;
    const exchangeRate = await ratesController.getExchangeRate(from, to);
    if (!exchangeRate?.success) {
      throw new Error('Failed to fetch exchange rate');
    }
    return exchangeRate;
  });

// TODO! this should not be a server action, instead happen when user updates email
// export const createEmailVerification = async (
//   formData: Partial<EmailVerification>
// ): CallApiRes<CreateEmailVerificationRes> => {
//   try {
//     const { data, status } = await callAPI<CreateEmailVerificationRes>({
//       url: '/emailVerification',
//       method: 'POST' as const,
//       data: formData,
//     });
//     if (!isHTTPSuccessStatus(status)) {
//       throw new Error(GET_UNHANDLED_ERROR);
//     }
//     return { success: true, emailVerification: data.emailVerification };
//   } catch (err) {
//     return notifyError(err);
//   }
// };

export const updateContractStatus = authActionClient
  .schema(CreateContractStatusDto)
  .action(async ({ ctx, parsedInput }) => {
    const result = await contractController.createContractStatus(
      parsedInput,
      ctx
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  });

export const deleteContractStatus = authActionClient
  .schema(z.object({ userId: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const result = await contractController.deleteContractStatus(
      parsedInput,
      ctx
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  });

export const confirmContractSignature = authActionClient
  .schema(z.void())
  .action(async ({ ctx, parsedInput }) => {
    const result = await contractController.confirmSignature(parsedInput, ctx);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  });

/**
 * =====================================
 * =============== ADMIN ===============
 * =====================================
 */

export const createSale = authActionClient
  .schema(CreateSaleDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! admin required
    const sales = await salesController.createSale(parsedInput, ctx);
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const updateSale = authActionClient
  .schema(UpdateSaleDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! admin required
    const sales = await salesController.updateSale(parsedInput, ctx);
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const createSaleInformation = authActionClient
  .schema(CreateSaleInformationDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! admin required
    const sales = await salesInformationController.upsertSaleInformation(
      parsedInput,
      ctx
    );
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const updateSaleInformation = authActionClient
  .schema(
    UpdateSaleInformationDto.extend({
      saleId: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { saleId, ...rest } = parsedInput;
    //TODO! admin required
    const sales = await salesInformationController.updateSaleInformation(
      saleId,
      rest,
      ctx
    );
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const updateSaleStatus = authActionClient
  .schema(UpdateSaleStatusDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! admin required
    const sales = await salesController.updateSaleStatus(parsedInput, ctx);
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const deleteSale = authActionClient
  .schema(DeleteSaleDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! admin required
    const sales = await salesController.deleteSale(parsedInput, ctx);
    if (!sales.success) {
      throw new Error(sales.message);
    }
    return sales.data;
  });

export const confirmAdminTransaction = authActionClient
  .schema(UpdateTransactionDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! ADMIN REQUIRED
    const transaction = await transactionsController.adminUpdateTransaction(
      parsedInput,
      ctx
    );
    if (!transaction.success) {
      throw new Error(transaction.message);
    }
    return transaction.data;
  });

export const cancelAllTransactions = authActionClient
  .schema(CancelAllTransactionsDto)
  .action(async ({ ctx, parsedInput }) => {
    //TODO! ADMIN REQUIRED
    const transaction = await transactionsController.adminUpdateTransaction(
      { ...parsedInput, status: TransactionStatus.CANCELLED },
      ctx
    );
    if (!transaction.success) {
      throw new Error(transaction.message);
    }
    return transaction.data;
  });
