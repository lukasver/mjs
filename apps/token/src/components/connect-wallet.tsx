"use client";
import { Button } from "@mjs/ui/primitives/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@mjs/ui/primitives/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { ConnectWalletButton } from "./connect-wallet-button";

export const ConnectWallet = () => {
	const _wallet = useConnect();
	const account = useAccount();
	const router = useRouter();

	const isConnected = account.status === "connected";

	useEffect(() => {
		if (isConnected) {
			router.push("/dashboard");
		}
	}, [isConnected, router]);

	return (
		<Card className="bg-transparent max-w-sm">
			<CardHeader>
				<CardTitle>Connect to a wallet</CardTitle>
				<CardDescription>
					You can now connect to an external wallet. Click MetaMask if you'd
					like to use it — or click Continue to skip for now.
				</CardDescription>
			</CardHeader>
			{/* <CardContent>test</CardContent> */}
			<CardFooter className="flex gap-2 justify-between">
				<Button
					variant="outline"
					className="flex-1"
					// disabled={isPending}
					type="button"
					onClick={() => router.push("/dashboard")}
				>
					Skip
				</Button>
				<ConnectWalletButton />
				{/* <Button
          variant='accent'
          className='flex-1'
          type='submit'
          // loading={isPending}
        >
          Connect
        </Button> */}
			</CardFooter>
		</Card>
	);
};
