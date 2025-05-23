"use client";

import { Button } from "@mjs/ui/primitives/button";
import { ToastAction } from "@mjs/ui/primitives/toast";
import { useToast } from "@mjs/ui/primitives/use-toast";

export default function ToastWithAction() {
	const { toast } = useToast();

	return (
		<Button
			variant="outline"
			onClick={() => {
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem with your request.",
					action: <ToastAction altText="Try again">Try again</ToastAction>,
				});
			}}
		>
			Show Toast
		</Button>
	);
}
