import { RegistrationSteps } from "@/common/enums";
import { API_USER } from "@/common/types/user";
import { Chain, SignMessageArgs } from "@wagmi/core";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { configureChains, createConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ALLOWED_CHAINS } from "./crypto/config";
import { callAPI } from "./fetch.service";

// interface CustomSignMessageArgs extends SignMessageArgs {
//   raw: SiweMessage;
// }

export enum SIGN_IN_TYPE {
	Zitadel = "zitadel",
	Wallet = "metamask-login",
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID;

export const SignInWithSIWE = async (
	signature: string,
	message: SiweMessage,
) => {
	return await signIn(SIGN_IN_TYPE.Wallet, {
		message: JSON.stringify(message),
		signature,
		callbackUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
	});
};

export const SignSIWEMessage = async (
	address: string,
	activeChain: Chain & { id: number; unsupported?: boolean },
	signMessage: (args?: SignMessageArgs) => Promise<string>,
) => {
	if (typeof window === "undefined") return;
	const gcft = await getCsrfToken();

	const message = new SiweMessage({
		domain: window.location.host,
		address,
		statement: "Sign in with Ethereum to the Smat ICO Dashboard",
		uri: window.location.origin,
		version: "1",
		chainId: activeChain?.id,
		nonce: gcft,
	});
	const signature = await signMessage({
		message: message.prepareMessage(),
	});
	return { signature, message };
};

export const CreateWagmiClient = (isDarkMode) => {
	const { chains, publicClient } = configureChains(ALLOWED_CHAINS, [
		alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_ID }),
		alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_ID }),
		alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_ID }),
		alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_ID }),
	]);

	return createConfig({
		autoConnect: true,
		connectors: [
			new MetaMaskConnector({
				chains,
				options: {
					shimDisconnect: true,
				},
			}),
			new WalletConnectConnector({
				chains,
				options: {
					projectId,
					showQrModal: true,
					qrModalOptions: {
						themeMode: `${isDarkMode ? "dark" : "light"}`,
						themeVariables: {
							"--wcm-z-index": "10000",
							"--wcm-overlay-background-color": "rgba(0, 0, 0, 0.1)",
						},
					},
				},
			}),
		],
		publicClient,
	});
};

export const isWalletUser = (user) => !!user?.isSiwe;

export const checkUserRegistrationStatus = async (req, res) => {
	const { data } = await callAPI<API_USER>({
		req,
		res,
		url: "/user",
	});
	if (!data) return "/login";
	if (data.user?.registrationStep === RegistrationSteps.NEW_ACCOUNT) {
		return "/registration";
	}
	return "";
};
