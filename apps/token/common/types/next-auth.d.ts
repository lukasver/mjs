import { SiweUser, ZitadelUser } from "./user";

type JWTUser = ZitadelUser | SiweUser;
type SessionUser = Omit<ZitadelUser, "roles"> | SiweUser;

declare module "next-auth/jwt" {
	interface JWT extends JWT {
		user: JWTUser;
		access_token: string;
		exp: number;
		iat: number;
		jti: string;
	}
}

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: SessionUser;
	}

	interface Profile {
		iss: string;
		aud: string[];
		azp: string;
		at_hash: string;
		c_hash: string;
		exp: number;
		iat: number;
		email: string;
		email_verified: boolean;
		family_name: string;
		given_name: string;
		name: string;
		preferred_username: string;
		sub: string;
		updated_at: number;
		"urn:zitadel:iam:org:domain:primary": string;
	}
}
