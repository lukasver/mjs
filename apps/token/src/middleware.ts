import log from "@/lib/services/logger.server";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_PREFIX } from "./common/config/contants";

const PUBLIC_ROUTES: string[] = ["/", "/onboarding"];
const PRIVATE_ROUTES: string[] = ["/dashboard"];

export default async (req: NextRequest) => {
	log("[MIDDLEWARE]", req.nextUrl.pathname);

	if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	const cookies = await getSessionCookie(req, {
		cookiePrefix: COOKIE_PREFIX,
	});

	// If no cookie is present, we should redirect to the login page
	if (!cookies) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: [
		"/((?!api|sitemap|robots|manifest.webmanifest|_next/static|_next/image|favicon.ico|icon*|apple-touch-*|public|assets|workers|.well-known).*)",
	],
};
