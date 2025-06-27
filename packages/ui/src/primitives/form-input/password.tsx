"use client";
import { cn } from "@mjs/ui/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { Input } from "../input";

export interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	type: "password";
	options?: never;
}

const PasswordInput = React.memo(function PasswordInput({
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	return (
		<div className="relative">
			<Input
				{...props}
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", props.className)}
				autoComplete="current-password"
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
				onClick={() => setShowPassword(!showPassword)}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="size-4" />
				) : (
					<Eye className="size-4" />
				)}
			</Button>
		</div>
	);
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
