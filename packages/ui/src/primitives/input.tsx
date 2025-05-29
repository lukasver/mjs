import * as React from "react";

import { cn } from "@mjs/ui/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-none bg-secondary-700/50 backdrop-blur-xs px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-[var(--input-shadow)]",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
