'use server';
import 'server-only';
import { actionClient, authActionClient } from './config';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser } from 'thirdweb';
import { getUserEmail } from 'thirdweb/wallets';
import {
  deleteSessionCookie,
  generateAuthPayload,
  generateJWT,
  getSessionCookie,
  serverClient,
  setSessionCookie,
  verifyAuthPayload,
} from '../auth/thirdweb';

const client = serverClient;

// export const signIn = actionClient
//   .schema(LoginSchema)
//   .action(async ({ parsedInput }) => {
//     const response = await auth.api.signInEmail({
//       body: {
//         email: parsedInput.username,
//         password: parsedInput.password,
//       },
//     });
//     return response;
//   });

// export const signUp = actionClient
//   .schema(
//     zfd.formData({
//       username: zfd.text(),
//       password: zfd.text(),
//     })
//   )
//   .action(async ({ parsedInput }) => {
//     const response = await auth.api.signUpEmail({
//       returnHeaders: true,
//       body: {
//         email: parsedInput.username,
//         password: parsedInput.password,
//         name: parsedInput.username,
//       },
//     });

//     return response.response;
//   });

export const isLoggedIn = actionClient.action(async () => {
  // const data = await auth.api.getSession({
  //   headers: await headers(),
  // });
  const data = await getSessionCookie();
  // TODO! If active session, return true check in DB if user is logged in with a valid session.
  return !!data; // data?.session && data.session.expiresAt > new Date();
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

export const login = actionClient
  .schema(LoginParams)
  .action(async ({ parsedInput }) => {
    const verifiedPayload = await verifyAuthPayload(parsedInput);

    if (!verifiedPayload.valid) {
      redirect('/?error=invalid_payload');
    }
    const { payload } = verifiedPayload;
    // Here should go the JWT logic
    const jwt = await generateJWT(payload, {
      address: payload.address,
      ...(payload.chain_id && { chainId: payload.chain_id }),
    });
    await setSessionCookie(jwt);
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
    return await generateAuthPayload({ chainId, address });
  });

export const logout = actionClient.action(async () => {
  // await auth.api.signOut({
  //   headers: await headers(),
  // });
  //TODO do other session related stuff to logout
  await deleteSessionCookie();
  redirect('/');
});

export const getCurrentUser = authActionClient.action(
  async ({ ctx: { address } }) => {
    console.debug('🚀 ~ index.ts:119 ~ address:', address);

    const user = await getUser({
      client,
      email: address,
      // walletAddress: address,
    });

    console.debug('🚀 ~ index.ts:123 ~ user:', user);

    return user;
  }
);

export const getCurrentUserEmail = authActionClient.action(async () => {
  const email = await getUserEmail({
    client,
  });
  return email;
});
