"use client";

import { ConnectWallet } from "@/components/connect-wallet";
import { client } from "@/lib/auth/thirdweb-client";
import { Icons } from "@mjs/ui/components/icons";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@mjs/ui/primitives/alert-dialog";
import { Button } from "@mjs/ui/primitives/button";
import React from "react";
import { AccountProvider as AccountProviderThirdweb } from "thirdweb/react";
import useActiveAccount from "../hooks/use-active-account";

function AccountProvider({ children }: { children: React.ReactNode }) {
	const { activeAccount, status, signout, isLoading } = useActiveAccount();

	const handleClose = async () => {
		await signout();
	};

	if (status === "disconnected") {
		return (
			<AlertDialog open={true}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<div className="flex items-center justify-between gap-2">
							<AlertDialogTitle className="flex-1">
								Please connect your wallet
							</AlertDialogTitle>
							<Button
								variant="ghost"
								size="icon"
								tabIndex={-1}
								onClick={() => {
									handleClose();
								}}
								loading={isLoading}
							>
								<Icons.x className="w-4 h-4" />
							</Button>
						</div>
						{/* <AlertDialogDescription>Lorem</AlertDialogDescription> */}
					</AlertDialogHeader>
					<ConnectWallet />
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	if (status === "unknown" || status === "connecting") {
		return (
			<AlertDialog open={true}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Connecting...</AlertDialogTitle>
						<AlertDialogDescription>Please wait</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex items-center justify-center h-full w-full">
						<Icons.loader className="w-10 h-10 animate-spin" />
					</div>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	if (activeAccount) {
		return (
			<AccountProviderThirdweb address={activeAccount.address} client={client}>
				{children}
			</AccountProviderThirdweb>
		);
	}

	if (status === "connected") {
		return (
			<div className="h-screen w-screen grid place-items-center">
				<Icons.loader className="w-10 h-10 animate-spin" />
			</div>
		);
	}

	console.debug("LLEGUE ACA?");

	return null;
}

export default AccountProvider;
