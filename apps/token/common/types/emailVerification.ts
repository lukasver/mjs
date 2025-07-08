import { EmailVerification } from "@prisma/client";

export interface CreateEmailVerificationRes {
	emailVerification: EmailVerification;
	success: true;
}
