"use server";
import "server-only";
import { LoginSchema } from "@/common/schemas/login";
import { zfd } from "zod-form-data";
import { auth } from "../auth";
import { actionClient } from "./config";

export const signIn = actionClient
	.schema(LoginSchema)
	.action(async ({ parsedInput }) => {
		const response = await auth.api.signInEmail({
			body: {
				email: parsedInput.username,
				password: parsedInput.password,
			},
		});

		console.debug("🚀 ~ index.ts:18 ~ response:", response);

		return response;
	});

export const signUp = actionClient
	.schema(
		zfd.formData({
			username: zfd.text(),
			password: zfd.text(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const response = await auth.api.signUpEmail({
			returnHeaders: true,
			body: {
				email: parsedInput.username,
				password: parsedInput.password,
				name: parsedInput.username,
			},
		});

		return response.response;
	});
