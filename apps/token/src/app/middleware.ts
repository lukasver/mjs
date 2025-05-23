import log from "@/lib/services/logger.server";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES: string[] = [];

export default async (req: NextRequest) => {
	log("middleware", req.nextUrl.pathname);

	if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const cookies = await getSessionCookie(req);

	// If no cookie is present, we should redirect to the login page
	if (!cookies) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		"/dashboard",
		"/admin/:path*",
		"/faq",
		"/transactions",
		"/buy-token/:path*",
	],
};
