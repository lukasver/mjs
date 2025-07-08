'use server';
import 'server-only';
import {
  generatePayload,
  isLoggedIn as isLoggedInAction,
  login,
  type LoginParams,
  logout,
} from '../actions';

export const isLoggedIn = async (address: string) => {
  const authResult = await isLoggedInAction(address);
  return !!authResult;
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
  const data = (await generatePayload({ address, chainId }))?.data;
  if (!data) {
    throw new Error('Failed to generate payload');
  }
  return data;
};

export const doLogout = async () => {
  await logout();
};
