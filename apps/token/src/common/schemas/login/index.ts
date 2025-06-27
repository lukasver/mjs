import { z } from "zod";

const LoginSchema = z.object({
	username: z
		.string()
		.email({ message: "Type in a valid email address" })
		.min(1, { message: "Username is required" })
		.trim(),
	password: z
		.string()
		.min(8, { message: "Password must contain at least 8 characters" })
		.max(64, { message: "Password can contain at most 64 characters" })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])[A-Za-z\d\W_]{8,}$/, {
			message:
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
		})
		.trim(),
});
export type LoginSchema = z.infer<typeof LoginSchema>;

const SignupSchema = LoginSchema;

export { LoginSchema, SignupSchema };
