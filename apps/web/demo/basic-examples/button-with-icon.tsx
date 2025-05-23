import { Mail } from "lucide-react";

import { Button } from "@mjs/ui/primitives/button";

export default function ButtonWithIcon() {
	return (
		<Button>
			<Mail className="mr-2 h-4 w-4" /> Login with Email
		</Button>
	);
}
