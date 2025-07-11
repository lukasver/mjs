import { Duration } from 'luxon';

export const MAX_FILE_SIZE = 10000000;
export const MAX_ALLOWANCE_WITHOUT_KYC = 5000;
export const COOKIE_PREFIX = 'mjs-td';
export const COOKIE_NAME = '_auth';
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_MONTH = 30 * ONE_DAY;
export const ONE_YEAR = 365 * ONE_DAY;
export const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
/**
 * Duration in seconds
 */
export const JWT_EXPIRATION_TIME = Duration.fromObject({ days: 1 }).as(
  'seconds'
);

export const FIAT_CURRENCIES = ['CHF', 'EUR', 'USD', 'GBP'] as const;
export const CRYPTO_CURRENCIES = [
  'ETH',
  'USDC',
  'MATIC',
  'LINK',
  'BNB',
] as const;

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  KYC_VERIFIER: 'KYC_VERIFIER',
  KYC_ADMIN: 'KYC_ADMIN',
  AMBASSADOR: 'AMBASSADOR',
} as const;
