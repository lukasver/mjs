import { TransactionModalTypes } from '../../common/enums';
import { FormInvestSchema } from '../../common/types/interfaces';
import { getTransactionModalTypeToOpen } from '@/utils/transactions';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { FOP, TransactionStatus } from '@prisma/client';
import {
  generateMockFormEntry,
  mockContract,
  mockTransactions,
  mockUsers,
} from '../mocks/helpers';

test.describe('TRANSACTIONS LOGIC', () => {
  test('Function getTransactionModalTypeToOpen should open the right modal for determined cases', async () => {
    const user = mockUsers({
      isSiwe: false,
    });
    const transaction = mockTransactions({
      status: TransactionStatus.PENDING,
      formOfPayment: FOP.CRYPTO,
      agreementId: faker.string.nanoid(44),
    });
    const contract = mockContract({ isSign: false });
    const result = getTransactionModalTypeToOpen(transaction, user, contract);
    verifyResult(result, transaction, user, contract);
  });

  test('Function getTransactionModalTypeToOpen should open the right modal for random amount of cases', async () => {
    const payloads = Array.from(Array(1000));
    let index = 0;
    for (const _payload of payloads) {
      const user = mockUsers();
      const transaction = mockTransactions();
      const contract = mockContract();
      const result = getTransactionModalTypeToOpen(transaction, user, contract);
      verifyResult(result, transaction, user, contract);
      index++;
      console.log(`Case number: ${index} ${result}`);
    }
  });

  test.describe('FormInvest schema should work as expected for different use cases', () => {
    test('Positive cases: ALL SHOULD PASS', () => {
      const txs = Array.from(Array(1000), () => generateMockFormEntry());
      for (const tx of txs) {
        const result = FormInvestSchema.safeParse(tx);
        expect(result.success, {
          message: `Invalid payload: ${JSON.stringify(tx)}
          ${result.success === false && result.error}`,
        }).toBe(true);
      }
    });
    test('Negative cases: all here should fail', () => {
      const cases = [
        generateMockFormEntry({
          // @ts-ignore
          formOfPayment: 'FAIL',
        }),
        generateMockFormEntry({
          // @ts-ignore
          formOfPayment: null,
        }),
        generateMockFormEntry({
          // @ts-ignore
          formOfPayment: 0,
        }),
        generateMockFormEntry({
          address: faker.finance.bitcoinAddress(),
        }),
        generateMockFormEntry({
          address: undefined,
        }),
        generateMockFormEntry({
          // @ts-ignore
          address: null,
        }),
        generateMockFormEntry({
          // @ts-ignore
          address: 0,
        }),
        generateMockFormEntry({
          address: '0x1234asdas123',
        }),
        generateMockFormEntry({
          // @ts-ignore
          quantity: null,
        }),
        generateMockFormEntry({
          // @ts-ignore
          quantity: undefined,
        }),
        generateMockFormEntry({
          // @ts-ignore
          quantity: 'asd',
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmountCrypto: Number.MAX_SAFE_INTEGER,
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmountCrypto: '2.34',
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmountCrypto: 9.99,
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmountCrypto: null,
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmountCrypto: undefined,
        }),
        generateMockFormEntry({
          paymentAmount: undefined,
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmount: null,
        }),
        generateMockFormEntry({
          // @ts-ignore
          paymentAmount: 'lalala',
        }),

        generateMockFormEntry({
          // @ts-ignore
          paymentAmount: '-123',
        }),

        generateMockFormEntry({
          // @ts-ignore
          paymentCurrency: 'LALALA',
        }),
      ];

      for (const one of cases) {
        const result = FormInvestSchema.safeParse(one);
        expect(result.success, { message: JSON.stringify(one) }).toBeFalsy();
      }
    });

    test('Specific case should pass', () => {
      const tx = {
        formOfPayment: 'TRANSFER',
        paymentCurrency: 'EUR',
        address: '0x459fB50CCA9d68526412ef33Ede61592005fEc36',
        paymentAmountCrypto: '',
        quantity: '123',
        paymentAmount: '29.4521',
      };
      const result = FormInvestSchema.safeParse(tx);
      expect(result.success, {
        message: `Invalid payload: ${JSON.stringify(tx)}
        ${result.success === false && result.error}`,
      }).toBe(true);
    });
  });
});

const verifyResult = (result, transaction, user, contract) => {
  const message = `
  SIWE: ${user.isSiwe},
  Status: ${transaction.status},
  FOP: ${transaction.formOfPayment},
  agreementId: ${transaction.agreementId},
  isSign: ${contract.isSign},
  urlSign: ${contract.urlSign}
 `;

  // user: NO SIWE
  // status: PENDING
  // contract: REQUIRED // NOT REQUIRED
  // signed: TRUE | FALSE
  // payment: CRYPTO | TRANSFER (FIAT)
  if (transaction.status === TransactionStatus.PENDING) {
    // Not implemented
    if (transaction.formOfPayment === FOP.CARD) {
      return expect(result, message).toBe(null);
    }

    if (transaction.agreementId) {
      if (contract.isSign) {
        if (transaction.formOfPayment === FOP.CRYPTO) {
          return expect(result, message).toBe(
            TransactionModalTypes.CryptoWarning
          );
        }
        if (transaction.formOfPayment === FOP.TRANSFER) {
          return expect(result, message).toBe(
            TransactionModalTypes.ManualTransfer
          );
        }
      } else {
        return expect(result, message).toBe(TransactionModalTypes.Contract);
      }
    } else {
      if (transaction.formOfPayment === FOP.CRYPTO) {
        return expect(result, message).toBe(
          TransactionModalTypes.CryptoWarning
        );
      }
      if (transaction.formOfPayment === FOP.TRANSFER) {
        return expect(result, message).toBe(
          TransactionModalTypes.ManualTransfer
        );
      }
    }
    throw new Error(`Case not handled properly` + message);
  }

  // default case
  return expect(result, message).toBe(null);
};
