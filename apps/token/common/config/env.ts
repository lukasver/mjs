import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const VERCEL_TARGET_ENV = process.env.VERCEL_TARGET_ENV;

/**
 * Determines the public URL for the application based on the deployment environment.
 *
 * When deploying to Vercel:
 * - For production and staging environments, uses the custom domain defined in NEXT_PUBLIC_DOMAIN
 * - For preview deployments, uses the auto-generated Vercel URL
 * - For other environments, tries NEXT_PUBLIC_DOMAIN first, falling back to Vercel URL
 *
 * @returns {string | undefined} The public URL to use for the application
 */
const getPublicUrl = () => {
	if (process.env.VERCEL) {
		const vercelUrl = `https://${process.env.VERCEL_URL}`;
		switch (VERCEL_TARGET_ENV) {
			case "production":
				return process.env.NEXT_PUBLIC_DOMAIN || vercelUrl;
			case "stage":
				return process.env.NEXT_PUBLIC_DOMAIN || vercelUrl;
			case "preview":
				return vercelUrl;
			default:
				return process.env.NEXT_PUBLIC_DOMAIN || vercelUrl;
		}
	}
	return process.env.NEXT_PUBLIC_DOMAIN!;
};

export const env = createEnv({
	server: {
		IS_PRODUCTION: z.boolean(),
		IS_DEV: z.boolean(),
		IS_TEST: z.boolean(),
		DEBUG: z.preprocess(
			(val) => val === "true" || val === "1",
			z.boolean().optional().default(false),
		),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().url().min(1),
		EMAIL_API_KEY: z.string().min(1),
		EMAIL_FROM: z.string().min(1),
		THIRDWEB_ADMIN_PRIVATE_KEY: z.string().min(1),
		THIRDWEB_API_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
		NEXT_PUBLIC_DOMAIN: z.string().url().optional(),
		NEXT_PUBLIC_LANGUAGE: z.string().optional().default("en"),
		NEXT_PUBLIC_DEBUG: z.preprocess(
			(val) => val === "true" || val === "1",
			z.boolean().optional().default(false),
		),
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
		NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS: z.string().min(1),
		NEXT_PUBLIC_MAIN_WALLET: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_DOMAIN: getPublicUrl(),
		NEXT_PUBLIC_LANGUAGE: process.env.NEXT_PUBLIC_LANGUAGE,
		NEXT_PUBLIC_DEBUG: process.env.DEBUG, // Same as DEBUG
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
			process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
		NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
		NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS:
			process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
		NEXT_PUBLIC_MAIN_WALLET: process.env.NEXT_PUBLIC_MAIN_WALLET,
		IS_PRODUCTION: process.env.NODE_ENV === "production",
		IS_DEV: process.env.NODE_ENV === "development",
		IS_TEST: process.env.NODE_ENV === "test",
		DEBUG: process.env.DEBUG,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		EMAIL_API_KEY: process.env.EMAIL_API_KEY,
		EMAIL_FROM: process.env.EMAIL_FROM,
		THIRDWEB_ADMIN_PRIVATE_KEY: process.env.THIRDWEB_ADMIN_PRIVATE_KEY,
		THIRDWEB_API_SECRET: process.env.THIRDWEB_API_SECRET,
	},
});

//Cannot do this with serverside variables
const _publicUrl = env.NEXT_PUBLIC_DOMAIN;

if (!_publicUrl) {
	throw new Error("Missing NEXT_PUBLIC_DOMAIN");
}

// force type inference to string
const publicUrl = _publicUrl;
export { publicUrl };
