// https://next-safe-action.dev/docs/safe-action-client/extend-a-client
// import { auth } from '../auth/better-auth/auth';

import { invariant } from "@epic-web/invariant";
import { createSafeActionClient } from "next-safe-action";
import { getSessionCookie, verifyJwt } from "../auth/thirdweb";
import log from "../services/logger.server";

import { User } from "@/common/schemas/generated";
import { prisma } from "@/db";
import { authCache } from "../auth/cache";

export const loginActionClient = createSafeActionClient({
	// Can also be an async function.
	handleServerError(e, _utils) {
		// You can accesse these properties inside the `utils` object.
		// const { clientInput, bindArgsClientInputs, metadata, ctx } = _utils;
		return e?.message || "Something went wrong";
	},
}).use(async ({ next, ctx }) => {
	const result = await next({
		ctx: {
			...ctx,
		},
	});
	if (!result.success) {
		log(`[ERROR loginActionClient]: ${JSON.stringify(result)}`);
	}
	return result;
});

/**
 * This action client is used with service actions that require an authed call.
 */
export const authActionClient = createSafeActionClient({
	// Can also be an async function.
	handleServerError(e, _utils) {
		// You can accesse these properties inside the `utils` object.
		// const { clientInput, bindArgsClientInputs, metadata, ctx } = _utils;
		return e?.message || "Something went wrong";
	},
})
	.use(async ({ next }) => {
		const token = await getSessionCookie();
		//TODO! here we should also check if the session is valid in the DB and query the session user.
		invariant(token, "Session not token");
		const verified = await verifyJwt(token);
		invariant(verified.valid, "Invalid jwt");
		let user: Pick<User, "id" | "walletAddress" | "email"> | undefined =
			await authCache.get(verified.parsedJWT.sub);
		if (!user) {
			user =
				(await prisma.user.findUnique({
					where: {
						walletAddress: verified.parsedJWT.sub,
					},
					select: {
						id: true,
						walletAddress: true,
						email: true,
					},
				})) || undefined;
			invariant(user, "User not found");
			await authCache.set(verified.parsedJWT.sub, user);
		}

		return next({
			ctx: {
				address: user.walletAddress,
				email: user.email,
				userId: user.id,
				jwtContent: verified.parsedJWT.ctx,
			},
		});
	})
	.use(async ({ next, ctx }) => {
		const result = await next({
			ctx,
		});

		if (!result.success) {
			log(`[ERROR authActionClient]: ${JSON.stringify(result)}`);
		}

		return result;
	});
