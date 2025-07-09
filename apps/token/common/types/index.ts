import { Currency } from "@prisma/client";

export type Exclude<T, U> = T extends U ? never : T;

export type CryptoCurrency = Exclude<Currency, "CHF" | "USD" | "EUR" | "GBP">;

export enum TransactionModalTypes {
	Loading = "loading",
	ManualTransfer = "manualTransfer",
	PendingTx = "pendingTransaction",
	WalletLogin = "walletLogin",
	ConfirmPayment = "confirmPayment",
	CryptoWarning = "cryptowarning",
	Contract = "contract",
	PendingContract = "pendingContract",
}
