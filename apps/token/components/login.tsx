"use client";

import { cn } from "@mjs/ui/lib/utils";
//
import { ConnectWallet } from "./connect-wallet";

export function LoginForm({ className }: { className?: string }) {
	return (
		<div className={cn("w-full [&>button]:w-full!", className)}>
			<ConnectWallet />
		</div>
	);
}
