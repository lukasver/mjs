import { FormInvestSchema } from '../../common/types/interfaces';
import { JWTUser } from '../../common/types/next-auth';
import { ActiveSale } from '../../common/types/sales';
import { SiweUser, ZitadelUser } from '../../common/types/user';
import { GetExchangeRate } from '@/services/pricefeeds/types';
import { faker } from '@faker-js/faker';
import {
  Currency,
  FOP,
  SaleStatus,
  SaleTransactions,
  TransactionStatus,
} from '@prisma/client';
import { parseUnits } from 'ethers/lib/utils';

export const EXCLUDED_CURRENCIES: Partial<Currency>[] = [
  Currency.MATIC,
  Currency.LINK,
  Currency.GBP,
];

export const FIAT_CURRENCIES = [
  Currency.CHF,
  Currency.EUR,
  Currency.USD,
  Currency.GBP,
];
export const CRYPTO_CURRENCIES = [
  Currency.ETH,
  Currency.USDC,
  Currency.MATIC,
  Currency.LINK,
];

export const ALL_CURRENCIES = Object.values(Currency);

export const ACCEPTED_CURRENCIES: Currency[] = Object.values(Currency).filter(
  (a) => EXCLUDED_CURRENCIES.includes(a)
);

export const mockTransactions = (
  data?: Partial<SaleTransactions>
  // config?: Partial<{ currency: Currency }>
) => {
  const status = faker.helpers.arrayElement(Object.values(TransactionStatus));
  return {
    uuid: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    tokenSymbol: 'SMAT',
    boughtTokenQuantity: faker.number.int({ min: 1, max: 9999 }),
    formOfPayment: faker.helpers.arrayElement(Object.values(FOP)),
    confirmationId: faker.datatype.boolean() ? faker.string.uuid() : null,
    receivingWallet: faker.finance.ethereumAddress(),
    status,
    userId: faker.string.numeric(18),
    saleId: faker.string.uuid(),
    comment: faker.datatype.boolean() ? faker.lorem.lines(1) : null,
    amountPaid: String(
      faker.number.float({
        min: 0.0001,
        max: 999999999,
        fractionDigits: 4,
      })
    ),
    amountPaidCurrency: Currency.CHF,
    txHash: (
      [
        TransactionStatus.CONFIRMED_BY_USER,
        TransactionStatus.CONFIRMED,
      ] as TransactionStatus[]
    ).includes(status)
      ? faker.finance.ethereumAddress()
      : null,
    agreementId: faker.string.nanoid(44),
    blockchainId: null,
    ...data,
  };
};

export const mockUsers = (
  data?: Partial<JWTUser>,
  type?: 'zitadel' | 'siwe'
): JWTUser => {
  if (type === 'siwe') {
    const wallet = faker.finance.ethereumAddress();
    return {
      id: faker.string.uuid(),
      sub: wallet,
      address: wallet,
      isSiwe: true,
      email: undefined,
      isAdmin: false,
      ...data,
    } as SiweUser;
  }

  const fullname = faker.person.fullName();
  const firstName = fullname.split(' ')[0];
  const lastName = fullname.split(' ')[1];
  const email = faker.internet.email();
  const sub = faker.string.numeric(18);
  return {
    id: sub,
    name: fullname,
    firstName: firstName,
    lastName: lastName,
    email: email,
    loginName: email,
    isAdmin: false,
    sub: sub,
    email_verified: true,
    isSiwe: false,
    ...data,
  } as ZitadelUser;
};

export const mockContract = (
  data?: Partial<{ isSign: boolean; urlSign: null | string }>,
  probability = 0.5
) => {
  return {
    isSign: faker.datatype.boolean({
      probability: Number.isInteger(probability)
        ? probability / 100
        : probability,
    }),
    urlSign: null,
    ...data,
  };
};

export const generateMockFormEntry = (
  tx?: Partial<FormInvestSchema>,
  type: 'BOTH' | 'CRYPTO' | 'FIAT' = 'BOTH'
) => {
  const currency = faker.helpers.arrayElement(
    type === 'BOTH'
      ? ACCEPTED_CURRENCIES
      : type === 'CRYPTO'
      ? CRYPTO_CURRENCIES
      : FIAT_CURRENCIES
  );
  const decimals = faker.helpers.arrayElement([...Array(19).keys()]);
  const float = `${faker.number.float({
    min: 0.1,
    max: 99999999,
    fractionDigits: decimals,
  })}`;
  const cryptoAmountInString = parseUnits(float, decimals);
  if (cryptoAmountInString.toString()) {
    //TODO CHECk, this ensures that the number has the correct amount of decimals but keeps the integers.
  }

  return {
    formOfPayment: FOP.CARD,
    quantity: faker.string.numeric({
      length: { min: 1, max: 7 },
      exclude: ['0'],
    }),
    address: faker.finance.ethereumAddress(),
    paymentAmount: faker.finance.amount({
      min: 0.111111111,
      max: 9999999.999929121,
    }),
    paymentCurrency: currency,
    paymentAmountCrypto:
      type !== 'FIAT' && CRYPTO_CURRENCIES.includes(currency as any)
        ? cryptoAmountInString
        : '',
    ...tx,
  } as FormInvestSchema;
};

export const generateMockSale = (data?: Partial<ActiveSale>): ActiveSale => {
  return {
    availableTokenQuantity: faker.number.int({ min: 10000, max: 99999 }),
    coverPicture: faker.image.urlPicsumPhotos(),
    createdAt: faker.date.past(),
    createdBy: faker.string.numeric(18),
    maximumTokenBuyPerUser: undefined,
    minimumTokenBuyPerUser: 1,
    name: faker.lorem.words(3),
    saftCheckbox: false,
    saleClosingDate: faker.date.future(),
    saleInformation: null,
    status: SaleStatus.OPEN,
    toWalletsAddress: faker.finance.ethereumAddress(),
    saleStartDate: faker.date.recent(),
    tokenSymbol: faker.helpers.arrayElement(CRYPTO_CURRENCIES),
    saleCurrency: Currency.CHF,
    tokenPricePerUnit: faker.finance.amount({
      min: 0.111111111,
      max: 9999.99,
    }),
    ...data,
  } as ActiveSale;
};

export const mockExchangeRates: GetExchangeRate = {
  // BTC: {
  //   USD: 61303.99,
  //   EUR: 56678.93,
  //   CHF: 53962.4,
  //   ETH: 17.99,
  //   BTC: 1,
  //   USDC: 61303.42
  // },
  ETH: {
    USD: 3407,
    EUR: 3148.78,
    CHF: 3005.43,
    ETH: 1,
    // BTC: 0.05559,
    USDC: 3407.37,
  },
  EUR: {
    USD: 1.081,
    EUR: 1,
    CHF: 0.9543,
    ETH: 0.0003176,
    // BTC: 0.00001764,
    USDC: 1.081,
  },
  USD: {
    USD: 1,
    EUR: 0.9252,
    CHF: 0.8824,
    ETH: 0.0002935,
    // BTC: 0.00001631,
    USDC: 1,
  },
  CHF: {
    USD: 1.133,
    EUR: 1.048,
    CHF: 1,
    ETH: 0.0003335,
    // BTC: 0.00001853,
    USDC: 1.133,
  },
  USDC: {
    USD: 0.9998,
    EUR: 0.9252,
    CHF: 0.8823,
    ETH: 0.0002935,
    // BTC: 0.00001631,
    USDC: 1,
  },
};
