"use client";

import { Button } from "@mjs/ui/primitives/button";
import { FormInput } from "@mjs/ui/primitives/form-input";
import { Label } from "@mjs/ui/primitives/label";
import clsx from "clsx";

/**
 * A newsletter input and button, used in LandingNewsletterSection, but can also be used as a standalone component in LandingPrimaryCta sections.
 */
export const LandingNewsletterInput = ({
	className,
	buttonLabel = "Subscribe",
	placeholderLabel = "Enter your email",
	inputLabel = "Email address",
	variant = "secondary",
	children,
	disabled = false,
}: {
	className?: string;
	buttonLabel?: string;
	placeholderLabel?: string;
	inputLabel?: string;
	variant?: "primary" | "secondary";
	children?: React.ReactNode;
	disabled?: boolean;
}) => {
	return (
		<div
			className={clsx(
				"w-full flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4",
				className,
			)}
		>
			<div className="grow w-full md:w-auto">
				<Label htmlFor="email" className="sr-only">
					{inputLabel}
				</Label>
				<FormInput
					name="email"
					type="email"
					inputProps={{
						id: "email",
						placeholder: placeholderLabel,
						required: true,
						autoComplete: "email",
						disabled: disabled,
						className: `shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]`,
					}}
					className="w-full min-w-[200px]"
				/>
			</div>

			{children || (
				<Button
					type="submit"
					className="w-full sm:w-auto"
					variant={variant}
					disabled={disabled}
				>
					{buttonLabel}
				</Button>
			)}
		</div>
	);
};
