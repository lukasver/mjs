'use server';
import 'server-only';
import { LoginSchema } from '../../common/schemas/login';
import { zfd } from 'zod-form-data';
import { auth, thirdwebAuth } from '../auth/better-auth/auth';
import { actionClient } from './config';
import { headers } from 'next/headers';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createThirdwebClient, getUser } from 'thirdweb';
import { getUserEmail } from 'thirdweb/wallets';
import { env } from '@/common/config/env';

const thirdwebClientOptions = createThirdwebClient({
  // clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  secretKey: env.THIRDWEB_API_SECRET,
});

export const signIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput }) => {
    const response = await auth.api.signInEmail({
      body: {
        email: parsedInput.username,
        password: parsedInput.password,
      },
    });
    return response;
  });

export const signUp = actionClient
  .schema(
    zfd.formData({
      username: zfd.text(),
      password: zfd.text(),
    })
  )
  .action(async ({ parsedInput }) => {
    const response = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: parsedInput.username,
        password: parsedInput.password,
        name: parsedInput.username,
      },
    });

    return response.response;
  });

export const isLoggedIn = actionClient.action(async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  // If active session, return true
  return data?.session && data.session.expiresAt > new Date();
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

export const login = actionClient
  .schema(LoginParams)
  .action(async ({ parsedInput }) => {
    const verifiedPayload = await thirdwebAuth.verifyPayload(parsedInput);

    if (!verifiedPayload.valid) {
      redirect('/?error=invalid_payload');
    }

    const response = await auth.api.signInAnonymous({
      headers: await headers(),
      query: {
        walletAddress: verifiedPayload.payload.address,
        chainId: verifiedPayload.payload.chain_id,
      },
    });

    response?.user.id;

    console.debug('🚀 ~ index.ts:64 ~ response:', response);
    redirect('/dashboard');
  });

export const generatePayload = actionClient
  .schema(
    z.object({
      address: z.string(),
      chainId: z.coerce.number(),
    })
  )
  .action(async ({ parsedInput: { chainId, address } }) => {
    return await thirdwebAuth.generatePayload({ chainId, address });
  });

export const logout = actionClient.action(async () => {
  console.debug('🚀 ~ auth.ts:65 ~ logout');
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');
});

export const getCurrentUser = actionClient
  .schema(
    z.object({
      address: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const user = await getUser({
      client: thirdwebClientOptions,
      walletAddress: parsedInput.address,
    });

    return user;
  });

export const getCurrentUserEmail = actionClient.action(async () => {
  const email = await getUserEmail({
    client: thirdwebClientOptions,
  });
  return email;
});
