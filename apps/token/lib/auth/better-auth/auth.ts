import 'server-only';
import { env } from '@/common/config/env';
import { prisma } from '@/common/db/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { createEmailService } from '@/lib/email';
import { COOKIE_PREFIX } from '@/common/config/contants';
import { anonymous } from 'better-auth/plugins/anonymous';
import { metadata } from '@/common/config/site';
import { client } from '@/lib/auth/thirdweb/thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { createAuth } from 'thirdweb/auth';

const email = createEmailService(env.EMAIL_API_KEY);

export const auth = betterAuth({
  user: {
    additionalFields: {
      walletAddress: {
        type: 'string',
        required: false,
      },
      createdAt: {
        type: 'date',
        required: false,
      },
      updatedAt: {
        type: 'date',
        required: false,
      },
      deletedAt: {
        type: 'date',
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          console.debug('🚀 ~ auth.ts:45 ~ user:', user);

          console.debug('🚀 ~ auth.ts:45 ~ ctx:', ctx);
          const query = ctx?.query;

          // Modify the user object before it is created
          return {
            data: {
              ...user,
              ...(query?.walletAddress && {
                walletAddress: query?.walletAddress,
                email: `${query?.walletAddress}::${query?.chainId}@${env.NEXT_PUBLIC_DOMAIN}`,
              }),
            },
          };
        },
        after: async (user) => {
          console.debug('🚀 ~ auth.ts:62 CREATED:', user);
          //perform additional actions, like creating a stripe customer
        },
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    debugLogs: false,
  }),
  emailAndPassword: {
    enabled: false,
  },
  // account: {
  //   accountLinking: {
  //     trustedProviders: ['google', 'github'],
  //   },
  // },
  appName: metadata.businessName,
  emailVerification: {
    expiresIn: 60 * 60 * 24,
    requireEmailVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, _request) => {
      const _url = new URL(url);
      _url.searchParams.set('token', token);
      await email.sendReactEmail(
        'emailVerification',
        { url: _url.toString() },
        {
          to: { email: user.email },
          subject: 'Verify your email address',
        }
      );
    },
  },
  advanced: {
    cookiePrefix: COOKIE_PREFIX,
  },
  plugins: [
    nextCookies(),
    anonymous({
      schema: {
        user: {
          fields: {
            isAnonymous: 'isSiwe',
          },
        },
      },
    }),
  ],
});

export const getSession = async () =>
  await auth.api.getSession({
    headers: await headers(), // some endpoint might require headers
  });

export const thirdwebAuth = createAuth({
  domain: env.NEXT_PUBLIC_DOMAIN!, // your domain
  client,
  // your backend wallet to sign login payloads
  adminAccount: privateKeyToAccount({
    client,
    privateKey: env.THIRDWEB_ADMIN_PRIVATE_KEY,
  }),
});
