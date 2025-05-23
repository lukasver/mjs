import Link from "next/link";

import { Button } from "@mjs/ui/primitives/button";

export default function ButtonAsChild() {
	return (
		<Button asChild>
			<Link href="/login">Login</Link>
		</Button>
	);
}
