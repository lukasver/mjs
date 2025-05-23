import "server-only";
import { env } from "@/common/config/env";
import { prisma } from "@/common/db/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";
import { createEmailService } from "./email";
import { headers } from "next/headers";

const email = createEmailService(env.EMAIL_API_KEY);

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
		debugLogs: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	account: {
		accountLinking: {
			trustedProviders: ["google", "github"],
		},
	},
	// socialProviders: {
	// 	facebook: {
	// 		clientId: process.env.FACEBOOK_CLIENT_ID || "",
	// 		clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
	// 	},
	// 	github: {
	// 		clientId: process.env.GITHUB_CLIENT_ID || "",
	// 		clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
	// 	},
	// 	google: {
	// 		clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
	// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
	// 	},
	// 	discord: {
	// 		clientId: process.env.DISCORD_CLIENT_ID || "",
	// 		clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
	// 	},
	// 	microsoft: {
	// 		clientId: process.env.MICROSOFT_CLIENT_ID || "",
	// 		clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
	// 	},
	// 	twitch: {
	// 		clientId: process.env.TWITCH_CLIENT_ID || "",
	// 		clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
	// 	},
	// 	twitter: {
	// 		clientId: process.env.TWITTER_CLIENT_ID || "",
	// 		clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
	// 	},
	// },
	appName: "MJS Token Dashboard",
	emailVerification: {
		expiresIn: 60 * 60 * 24,
		requireEmailVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url, token }, _request) => {
			const _url = new URL(url);
			_url.searchParams.set("token", token);
			await email.sendReactEmail(
				"emailVerification",
				{ url: _url.toString() },
				{
					to: { email: user.email },
					subject: "Verify your email address",
				},
			);
		},
	},
	// google: {
	// 	enabled: true,
	// },
	advanced: {
		cookiePrefix: COOKIE_PREFIX,
	},
	plugins: [passkey(), nextCookies()],
});

export const getSession = async () =>
	await auth.api.getSession({
		headers: await headers(), // some endpoint might require headers
	});
