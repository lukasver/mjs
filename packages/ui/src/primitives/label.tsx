"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@mjs/ui/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

function Label({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
	VariantProps<typeof labelVariants>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				labelVariants(),
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
