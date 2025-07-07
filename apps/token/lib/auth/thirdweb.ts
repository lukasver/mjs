import 'server-only';
import { env, publicUrl } from '@/common/config/env';
import { createThirdwebClient } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { createAuth } from 'thirdweb/auth';
import { LoginParams } from '../actions';
import { COOKIE_NAME, COOKIE_PREFIX } from '@/common/config/contants';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { Duration } from 'luxon';

// secretKey for serverside usage, wont be available in client
export const serverClient = createThirdwebClient({
  secretKey: env.THIRDWEB_API_SECRET,
  teamId: 'team_cmbakugit008e9j0kq3a1l0c0',
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

const auth = createAuth({
  domain: publicUrl,
  client: serverClient,
  adminAccount: privateKeyToAccount({
    client: serverClient,
    privateKey: env.THIRDWEB_ADMIN_PRIVATE_KEY,
  }),
  jwt: {
    // One day
    expirationTimeSeconds: Duration.fromObject({ days: 1 }).as('seconds'),
  },
  // login: {
  //   payloadExpirationTimeSeconds: Duration.fromObject({ days: 1 }).as(
  //     'seconds'
  //   ),
  //   uri: publicUrl,
  // },
});

export const generateAuthPayload = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  return auth.generatePayload({ address, chainId });
};

export const verifyAuthPayload = async (payload: LoginParams) => {
  return auth.verifyPayload(payload);
};

export const verifyJwt = async (jwt: string) => {
  return auth.verifyJWT({ jwt });
};

export const generateJWT = async (
  payload: Extract<
    Awaited<ReturnType<typeof verifyAuthPayload>>,
    { valid: true }
  >['payload'],
  ctx?: Record<string, string>
) => {
  return auth.generateJWT({ payload, context: ctx });
};

/**
 *
 */
export const getSessionCookie = async (
  req?: NextRequest,
  opts: { cookiePrefix?: string } = {
    cookiePrefix: COOKIE_PREFIX,
  }
) => {
  let c = null;
  const cookieName = opts.cookiePrefix + COOKIE_NAME;
  if (req) {
    c = req.cookies;
  } else {
    c = await cookies();
  }
  const value = c.get(cookieName)?.value || null;
  return value;
};

export const setSessionCookie = async (
  jwt: string,
  opts: { cookiePrefix?: string } = {
    cookiePrefix: COOKIE_PREFIX,
  }
) => {
  const cookieName = opts.cookiePrefix + COOKIE_NAME;
  const c = await cookies();
  // Extract hostname from publicUrl
  const domain = new URL(publicUrl).hostname;
  c.set(cookieName, jwt, {
    domain,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, //TODO! 30 days. Review this
    path: '/',
    sameSite: 'strict',
  });
};

export const deleteSessionCookie = async (
  opts: { cookiePrefix?: string } = {
    cookiePrefix: COOKIE_PREFIX,
  }
) => {
  const cookieName = opts.cookiePrefix + COOKIE_NAME;
  console.debug('\x1b[31mDELETING SESSION COOKIE:\x1b[0m', cookieName);
  const c = await cookies();
  c.delete(cookieName);
};
