"use client";

import { Button } from "@mjs/ui/primitives/button";
import { useToast } from "@mjs/ui/primitives/use-toast";

export default function ToastSimple() {
	const { toast } = useToast();

	return (
		<Button
			variant="outline"
			onClick={() => {
				toast({
					description: "Your message has been sent.",
				});
			}}
		>
			Show Toast
		</Button>
	);
}
