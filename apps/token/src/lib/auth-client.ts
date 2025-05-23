import { env } from "@/common/config/env";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_DOMAIN,
});
