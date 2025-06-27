import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
	throw new Error("No client ID provided");
}

export const wallets = [
	inAppWallet({
		auth: {
			options: ["google", "guest", "email"],
		},
	}),
	createWallet("io.metamask"),
	createWallet("com.coinbase.wallet"),
	createWallet("me.rainbow"),
	createWallet("io.rabby"),
	createWallet("io.zerion.wallet"),
];

export const client = createThirdwebClient({
	clientId: clientId,
});
