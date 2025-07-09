import { geolocation, ipAddress } from "@vercel/functions";
import { type NextRequest, userAgent } from "next/server";

export const getIpAddress = (req: Headers | NextRequest) => {
	return ipAddress(req);
};

export const getGeolocation = (req: NextRequest) => {
	return geolocation(req);
};

/**
 * Returns the formatted user agent string from the request.
 * @param req - The Next.js request object
 * @returns The user agent string or object based on asObject parameter
 */
export function getUserAgent(headers: Headers): string;
export function getUserAgent(headers: Headers, asObject: false): string;
export function getUserAgent(
	headers: Headers,
	asObject: true,
): ReturnType<typeof userAgent>;
export function getUserAgent(
	headers: Headers,
	asObject = false,
): string | ReturnType<typeof userAgent> {
	return asObject ? userAgent({ headers }) : userAgent({ headers }).ua;
}
