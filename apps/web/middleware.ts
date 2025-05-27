import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";
import { NextRequest } from "next/server";

export default (req: NextRequest) => {
	console.log("\x1b[31m[MIDDLEWARE]", req.nextUrl.pathname, "\x1b[0m");
	return createMiddleware(routing)(req);
};

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
