'use server';
import 'server-only';
import {
  generatePayload,
  isLoggedIn as isLoggedInAction,
  login,
  type LoginParams,
  logout,
} from '../actions';

export const isLoggedIn = async () => {
  const authResult = await isLoggedInAction();
  if (!authResult) return false;
  return true;
};

export const doLogin = async (params: LoginParams) => {
  await login(params);
};

interface GetLoginPayload {
  address: string;
  chainId: number;
}
export const getLoginPayload = async ({
  address,
  chainId,
}: GetLoginPayload) => {
  console.debug('🚀 ~ getLoginPayload ~ chainId:', chainId);
  console.debug('🚀 ~ getLoginPayload ~ address:', address);

  const data = (await generatePayload({ address, chainId }))?.data;
  if (!data) {
    throw new Error('Failed to generate payload');
  }
  return data;
};

export const doLogout = async () => {
  console.debug('🚀 ~ functions.ts:65 ~ logout');
  await logout();
};
