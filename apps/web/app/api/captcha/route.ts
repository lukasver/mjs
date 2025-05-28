import { createChallenge, verifySolution } from "altcha-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { templates } from "@mjs/emails";

const resend = new Resend(process.env.EMAIL_API_KEY);

const hmacKey = process.env.ALTCHA_HMAC_KEY!;
if (!hmacKey) {
	throw new Error("ALTCHA_HMAC_KEY is not set");
}

export const GET = async (_req: Request) => {
	// Create a new challenge and send it to the client:
	const challenge = await createChallenge({
		hmacKey,
		maxNumber: 100000, // the maximum random number
	});
	return NextResponse.json(challenge);
};

export const POST = async (req: Request) => {
	const body = await req.json();

	const { name, email, subject, message, captcha } = body;

	if (!name || !email || !subject || !message) {
		return NextResponse.json(
			{ error: "All fields are required", success: false },
			{ status: 400 },
		);
	}

	if (!captcha) {
		return NextResponse.json(
			{ error: "Captcha is required", success: false },
			{ status: 400 },
		);
	}

	// Verify the submitted payload
	const verified = await verifySolution(captcha, hmacKey);

	if (verified) {
		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: process.env.EMAIL_FROM!, // Replace with your domain
			to: [process.env.NEXT_PUBLIC_CONTACT_EMAIL!], // Replace with your email
			subject: `Contact Form: ${subject}`,
			react: templates["contact"]({
				name,
				email,
				subject,
				message,
			}),
			replyTo: email, // This allows you to reply directly to the sender
		});
		// Verification successful - process the submission

		const result: { success: boolean; error?: string } = {
			success: !!data,
		};

		if (error) {
			result.error = error.message;
		}

		return NextResponse.json(result);
	} else {
		return NextResponse.json({
			success: false,
			error: "Captacha verification failed",
		});
	}
};
