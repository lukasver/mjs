// https://next-safe-action.dev/docs/safe-action-client/extend-a-client
import { auth } from "@/lib/auth";

import { invariant } from "@epic-web/invariant";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import log from "../services/logger.server";

export const actionClient = createSafeActionClient({
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
		log(`[ERROR]: ${JSON.stringify(result)}`);
	} else {
		console.log(
			"\x1b[32m%s\x1b[0m",
			`[DEBUG Data]: ${JSON.stringify(result.data)}`,
		);
		console.debug(`[DEBUG ParsedInput]: ${JSON.stringify(result.parsedInput)}`);
	}
	return result;
});

/**
 * This action client is used with service actions that require an authed call.
 */
export const authActionClient = actionClient.use(async ({ next }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	invariant(session, "Session not found");
	invariant(session.user, "User not found");
	return next({
		ctx: {
			session: session,
			user: session.user,
		},
	});
});
