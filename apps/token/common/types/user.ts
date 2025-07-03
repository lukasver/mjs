import { Prisma, Profile, User } from "@prisma/client";
import { SessionUser } from "./next-auth";

export enum AUTH_ROLES {
	Admin = "admin",
	User = "user",
	Ambassador = "ambassador",
}

export interface API_USER {
	user: User & { profile: Profile };
}

export const isZitadelUser = (user?: SessionUser): user is ZitadelUser => {
	return Boolean(user) && user?.isSiwe === false && "firstName" in user;
};
export interface ZitadelUser {
	email_verified?: boolean;
	id: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	loginName?: string;
	image?: string;
	roles?: {
		admin?: { [orgId: string]: string };
		user?: { [orgId: string]: string };
		ambassador?: { [orgId: string]: string };
	};
	isSiwe: false;
	isAdmin?: boolean;
	sub?: string;
}

export interface SiweUser {
	id: string;
	sub: string;
	address: string;
	isSiwe: true;
	email?: string;
	roles?: never;
	isAdmin?: boolean;
}
export interface PersonalInfo {
	title?: "Mr" | "Ms" | "" | null;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	phoneNumber: string;
	promoCode?: string;
	address: Address;
}
export interface Address {
	street: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
}

// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
const UserWithProfileAndAddress = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: { profile: { include: { address: true } } },
});

// 3: This type will include a user and all their posts
export type UserWithProfileAndAddress = Prisma.UserGetPayload<
	typeof UserWithProfileAndAddress
>;
