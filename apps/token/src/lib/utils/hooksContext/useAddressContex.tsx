import { signOut, useSession } from "next-auth/react";
import { ReactNode, useContext } from "react";
import { createContext } from "react";
import { useAccount } from "wagmi";

export const AddressContext = createContext<{
	// isAvailable: boolean;
	// requestReview: () => Promise<void>;
	// requestReviewWithTimeout: (timeout?: number) => NodeJS.Timeout | undefined;
	// setActionsCount: Dispatch<SetStateAction<number>>;
}>({
	// isAvailable: false,
	// requestReview: () => Promise.resolve(),
	// requestReviewWithTimeout: () => undefined,
	// setActionsCount: () => 0,
});

const NOT_ALLOWED_LOGIN_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/login?notAllowed`;

async function handleSiweUserLogout(address: string | undefined) {
	try {
		await signOut({
			callbackUrl: address
				? `${NOT_ALLOWED_LOGIN_URL}=${address}`
				: NOT_ALLOWED_LOGIN_URL,
		});
	} catch (error) {
		console.error("Error during sign out:", error);
	}
}
export async function useAddressContext() {
	const session = useSession();
	const { address } = useAccount();

	const isSiweUser = session?.data?.user?.isSiwe;
	//@ts-expect-error
	const sessionAddress = session?.data?.user?.address || undefined;

	if (isSiweUser && !address) {
		await handleSiweUserLogout(undefined);
	}

	if (isSiweUser && address && sessionAddress && address !== sessionAddress) {
		await handleSiweUserLogout(address);
	}

	return {
		isSiweUser,
		sessionAddress,
	};
}

export const useAddressInfo = () => useContext(AddressContext);

export function AddressProvider({ children }: { children: ReactNode }) {
	const context = useAddressContext();
	return (
		<AddressContext.Provider value={context}>
			{children}
		</AddressContext.Provider>
	);
}
