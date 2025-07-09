import { ROLES } from "@/common/config/constants";
import { prisma } from "@/db";
import { adminCache } from "@/lib/auth/cache";
import { User } from "@prisma/client";
import { authActionClient } from "./config";

const isAdmin = adminCache.wrap(async (walletAddress: string) => {
	return await prisma.user.findUniqueOrThrow({
		where: {
			walletAddress,
			userRole: {
				some: {
					role: {
						name: {
							in: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
						},
					},
				},
			},
		},
		select: {
			id: true,
		},
	});
});

const adminMiddleware: Parameters<typeof authActionClient.use>[0] = async ({
	next,
	ctx,
}) => {
	let authed: Pick<User, "id"> | null = null;
	try {
		authed = await isAdmin(ctx.address);
	} catch (_e: unknown) {
		console.log(
			"NON ADMIN, NOT CACHEEABLE",
			_e instanceof Error ? _e.message : _e,
		);
		authed = null;
	}
	return next({
		ctx: {
			...ctx,
			isAdmin: !!authed,
			userId: authed?.id,
		},
	});
};

/**
 * Use this client for sensistive administrative actions only
 */
export const adminClient = authActionClient.use(adminMiddleware);
